"use client";
import { useEffect, useMemo, useState } from "react";
import { Search } from "../../components/Searches";
import { getAccessToken, removeAccessToken } from "../../utils/auth.util";
import { apiAxios } from "../../utils/api.util";
import { LiftTable } from "../../components/Tables";
import { Collapse } from "../../components/Collapses";
import { AddSetModal } from "../../components/Modals";
import { PercentageDownIcon, PercentageUpIcon } from "../../components/Icons";
import useAuth from "../../hooks/useAuth";
import { extractError } from "../../utils/error.util";

export default function Page() {
  const { accessToken, user, logOut } = useAuth();
  const [oldVolumes, setOldVolumes] = useState({});

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [sets, setSets] = useState([]);
  const [trainingSession, setTrainingSession] = useState({
    id: "",
    exercises: [],
  });
  const [modalData, setModalData] = useState(null);

  const handleQueryChange = (value) => {
    if (value === "") setSuggestions([]);
    setQuery(value);
  };

  const handleAutocomplete = (option) => {
    setSuggestions([]);
    setQuery("");

    // add old volume for this exercise
    apiAxios.get(`/users/me/training-sessions/last-volume?exerciseId=${option.id}`, { headers: { Authorization: "Bearer " + accessToken } }).then((res) => {
      const vol = res.data.volume;

      setOldVolumes({ ...oldVolumes, [option.id]: vol });
    });

    // add set to the backend
    apiAxios
      .post(`/training-sessions/${trainingSession.id}/exercises`, { exerciseId: option.id }, { headers: { Authorization: "Bearer " + accessToken } })
      .then((res) => {
        // add set to the trainingSession
        setTrainingSession({ ...trainingSession, exercises: [...trainingSession.exercises, { exercise: { id: option.id, name: option.value }, sets: [] }] });
      });
  };

  const handleSetAdded = ({ exercise, set }) => {
    const { reps, weight } = set;
    setModalData(null);
    console.log("d", exercise, set);

    // add to backend
    apiAxios
      .post(`/training-sessions/${trainingSession.id}/exercises/${exercise.id}/sets`, { reps, weight }, { headers: { Authorization: "Bearer " + accessToken } })
      .then((res) => {
        // add on frontend
        const set = res.data;

        const newTrainingSession = { ...trainingSession };
        const exerciseIndex = newTrainingSession.exercises.findIndex((innerExercise) => innerExercise.exercise.id === exercise.id);
        newTrainingSession.exercises[exerciseIndex].sets.push(set);

        setTrainingSession(newTrainingSession);
      });
  };

  const handleSetCancel = () => {
    setModalData(null);
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

  useEffect(() => {
    if (accessToken && !trainingSession.id) {
      // find training session

      apiAxios
        .get("/users/me/training-sessions/today", { headers: { Authorization: "Bearer " + accessToken } })
        .then((res) => {
          console.log("r", res.data);
          setTrainingSession(res.data);

          // add old volume for this exercise
          res.data.exercises.forEach((exercise) => {
            apiAxios
              .get(`/users/me/training-sessions/last-volume?exerciseId=${exercise.exercise.id}`, { headers: { Authorization: "Bearer " + accessToken } })
              .then((res) => {
                const vol = res.data.volume;

                setOldVolumes({ ...oldVolumes, [exercise.exercise.id]: vol });
              });
          });
        })
        .catch((err) => {
          const { status } = extractError(err);
          if (status === 404) {
            // create new session
            apiAxios.post("/training-sessions", {}, { headers: { Authorization: "Bearer " + accessToken } }).then((res) => {
              console.log("new session created");
              setTrainingSession(res.data);
            });
          }
        });
    }
  }, [accessToken]);

  return (
    <div className="mx-4">
      <div className="max-w-[300px] mx-auto mt-10 mb-5 px-4">
        <Search value={query} onChange={handleQueryChange} options={suggestions} onAutocomplete={handleAutocomplete} />
      </div>

      {/* <div className="mb-5">
        <h3 className="flex">
          Total Volume Increased: <span className="ml-2 text-success">10% </span>
          <PercentageUpIcon />
        </h3>
      </div> */}

      {modalData && (
        <AddSetModal
          exercise={modalData.exercise}
          set={{ id: modalData.id, reps: modalData.reps, weight: modalData.weight }}
          onSave={handleSetAdded}
          onCancel={handleSetCancel}
        />
      )}

      <div className="">
        {trainingSession.exercises.map((exercise, i) => {
          let newVolume = 0;
          exercise.sets.forEach((set) => {
            newVolume += set.reps * set.weight;
          });

          return (
            <div className="py-1" key={exercise.exercise.id}>
              <Collapse
                id={i + 1}
                label={exercise.exercise.name}
                oldVolume={oldVolumes[exercise.exercise.id]}
                newVolume={newVolume}
                onAdd={() => setModalData({ exercise: exercise.exercise, id: exercise.sets.length + 1, reps: "", weight: "" })}
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

const dum = [
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
];
