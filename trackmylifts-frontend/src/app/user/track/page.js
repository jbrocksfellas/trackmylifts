"use client";
import { useEffect, useState } from "react";
import { Search } from "../../components/Searches";
import { getAccessToken, removeAccessToken } from "../../utils/auth.util";
import { apiAxios } from "../../utils/api.util";
import { LiftTable } from "../../components/Tables";
import { Collapse } from "../../components/Collapses";
import { AddSetModal } from "../../components/Modals";
import { PercentageDownIcon, PercentageUpIcon } from "../../components/Icons";

export default function Page() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [sets, setSets] = useState([]);
  const [trainingSession, setTrainingSession] = useState({
    exercises: [
      {
        exercise: { id: 1, name: "Bench Press" },
        sets: [
          { id: 1, reps: 10, weight: 100 },
          { id: 2, reps: 10, weight: 110 },
          { id: 3, reps: 10, weight: 115 },
        ],
      },
      {
        exercise: { id: 1, name: "Squats" },
        sets: [
          { id: 1, reps: 10, weight: 100 },
          { id: 2, reps: 10, weight: 110 },
          { id: 3, reps: 10, weight: 115 },
        ],
      },
      {
        exercise: { id: 1, name: "Deadlift" },
        sets: [
          { id: 1, reps: 10, weight: 100 },
          { id: 2, reps: 10, weight: 110 },
          { id: 3, reps: 10, weight: 115 },
        ],
      },
    ],
  });
  const [modalData, setModalData] = useState(null);

  const handleQueryChange = (value) => {
    if (value === "") setSuggestions([]);
    setQuery(value);
  };

  const handleAutocomplete = (option) => {
    console.log(option);
    setSuggestions([]);
    setQuery("");

    // add set to the backend
    // add set to the trainingSession
    setTrainingSession({ exercises: [...trainingSession.exercises, { exercise: { id: option.id, name: option.value }, sets: [] }] });
  };

  const handleSetAdded = (data) => {
    const { reps, weight } = data;
    setModalData(null);

    // add to backend

    // add on frontend
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        apiAxios
          .get(`/exercises?query=${query}`, { headers: { Authorization: "Bearer " + getAccessToken() } })
          .then((res) => {
            console.log(res);

            // remove already added suggestions
            const newSuggestions = res.data.exercises.filter((exercise) => {
              const alreadyPresent = trainingSession.exercises.some((innerExercise) => {
                return exercise.name === innerExercise.exercise.name;
              });

              return !alreadyPresent;
            });
            setSuggestions(newSuggestions.map((exercise) => ({ id: exercise.id, value: exercise.name })));
          })
          .catch((err) => {
            console.log(err);
            // removeAccessToken();
          });
      } else {
        setSuggestions([]);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="mx-4">
      <div className="max-w-[300px] mx-auto mt-10 mb-5 px-4">
        <Search value={query} onChange={handleQueryChange} options={suggestions} onAutocomplete={handleAutocomplete} />
      </div>

      <div className="mb-5">
        <h3 className="flex">
          Total Volume Increased: <span className="ml-2 text-success">10% </span>
          <PercentageUpIcon />
        </h3>
      </div>

      {modalData && (
        <AddSetModal exercise={modalData.exercise} set={{ id: modalData.id, reps: modalData.reps, weight: modalData.weight }} onSave={handleSetAdded} />
      )}

      <div className="">
        {trainingSession.exercises.map((exercise, i) => {
          return (
            <div className="py-1">
              <Collapse
                id={i + 1}
                label={exercise.exercise.name}
                onAdd={() => setModalData({ exercise: exercise.exercise.name, id: exercise.sets.length + 1, reps: "", weight: "" })}
              >
                <LiftTable sets={exercise.sets} />
              </Collapse>
            </div>
          );
        })}
      </div>
    </div>
  );
}
