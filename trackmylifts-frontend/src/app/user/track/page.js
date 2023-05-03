"use client";
import { useEffect, useState } from "react";
import { Search } from "../../components/Searches";
import { getAccessToken } from "../../utils/auth.util";
import { apiAxios } from "../../utils/api.util";
import { LiftTable } from "../../components/Tables";
import { Collapse } from "../../components/Collapses";
import { AddSetModal } from "../../components/Modals";
import useAuth from "../../hooks/useAuth";
import { extractError } from "../../utils/error.util";

export default function Page() {
  const { accessToken, user, logOut } = useAuth();
  const [oldVolumes, setOldVolumes] = useState({});

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [trainingSession, setTrainingSession] = useState({
    id: "",
    exercises: [],
  });
  const [modalData, setModalData] = useState(null);

  const handleQueryChange = (value) => {
    if (value === "") setSuggestions([]);
    setQuery(value);
  };

  const handleAutocomplete = async (option) => {
    setSuggestions([]);
    setQuery("");

    // add set to the backend
    await apiAxios.post(
      `/training-sessions/${trainingSession.id}/exercises`,
      { exerciseId: option.id },
      { headers: { Authorization: "Bearer " + accessToken } }
    );

    // add set to the trainingSession
    setTrainingSession({ ...trainingSession, exercises: [...trainingSession.exercises, { exercise: { id: option.id, name: option.value }, sets: [] }] });

    // add old volume for this exercise
    const { data } = await apiAxios.get(`/users/me/training-sessions/last-volume?exerciseId=${option.id}`, {
      headers: { Authorization: "Bearer " + accessToken },
    });

    const vol = data.volume;
    setOldVolumes({ ...oldVolumes, [option.id]: vol });
  };

  const handleSetAdded = async ({ exercise, set, edited }) => {
    if (edited) {
      // update set
      console.log("edited", set);
      const { reps, weight } = set;

      // update on backend
      const { data: updatedSet } = await apiAxios.put(
        `/training-sessions/${trainingSession.id}/exercises/${exercise.id}/sets/${set.id}`,
        { reps, weight },
        { headers: { Authorization: "Bearer " + accessToken } }
      );

      setModalData(null);

      // update on frontend
      const newTrainingSession = { ...trainingSession };
      const exerciseIndex = newTrainingSession.exercises.findIndex((innerExercise) => innerExercise.exercise.id === exercise.id);
      const setIndex = newTrainingSession.exercises[exerciseIndex].sets.findIndex((innerSet) => innerSet.id === set.id);
      newTrainingSession.exercises[exerciseIndex].sets[setIndex] = updatedSet;
      setTrainingSession(newTrainingSession);
    } else {
      const { reps, weight } = set;
      setModalData(null);
      console.log("exercise, set", exercise, set);

      // add to backend
      const { data: addedSet } = await apiAxios.post(
        `/training-sessions/${trainingSession.id}/exercises/${exercise.id}/sets`,
        { reps, weight },
        { headers: { Authorization: "Bearer " + accessToken } }
      );

      // add on frontend
      const newTrainingSession = { ...trainingSession };
      const exerciseIndex = newTrainingSession.exercises.findIndex((innerExercise) => innerExercise.exercise.id === exercise.id);
      newTrainingSession.exercises[exerciseIndex].sets.push(addedSet);

      setTrainingSession(newTrainingSession);
    }
  };

  const handleSetCancel = () => {
    setModalData(null);
  };

  const handleDeleteSet = async (set) => {
    console.log("deleting set", set);

    // delete set from backend
    await apiAxios.delete(`/training-sessions/${trainingSession.id}/exercises/${set.exercise.id}/sets/${set.id}`, {
      headers: { Authorization: "Bearer " + accessToken },
    });

    // delete from frontend
    const newTrainingSession = { ...trainingSession };
    const exerciseIndex = newTrainingSession.exercises.findIndex((innerExercise) => innerExercise.exercise.id === set.exercise.id);
    const setIndex = newTrainingSession.exercises[exerciseIndex].sets.findIndex((innerSet) => innerSet.id === set.id);
    newTrainingSession.exercises[exerciseIndex].sets.splice(setIndex, 1);

    setTrainingSession(newTrainingSession);
  };

  const handleEditSet = async (set) => {
    console.log("editing set", set);
    setModalData({ exercise: set.exercise, id: set.id, tempId: set.index + 1, reps: set.reps, weight: set.weight, editing: true });
  };

  const handleDeleteExercise = async (exercise) => {
    console.log("delete exercise", exercise);
    // delete on backend
    await apiAxios.delete(`/training-sessions/${trainingSession.id}/exercises/${exercise.id}`, { headers: { Authorization: "Bearer " + accessToken } });

    // delete on frontend
    const newTrainingSession = { ...trainingSession };
    const exerciseIndex = newTrainingSession.exercises.findIndex((innerExercise) => innerExercise.exercise.id === exercise.id);
    newTrainingSession.exercises.splice(exerciseIndex, 1);

    setTrainingSession(newTrainingSession);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        apiAxios
          .get(`/exercises?query=${query}`, { headers: { Authorization: "Bearer " + getAccessToken() } })
          .then((res) => {
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
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    if (accessToken && !trainingSession.id) {
      const fetchData = async () => {
        try {
          // find training session
          const { data: fetchedTrainingSession } = await apiAxios.get("/users/me/training-sessions/today", {
            headers: { Authorization: "Bearer " + accessToken },
          });
          setTrainingSession(fetchedTrainingSession);

          // find exercises volume
          const tempOldVolumes = {};
          await Promise.all(
            fetchedTrainingSession.exercises.map(async (exercise) => {
              const { data } = await apiAxios.get(`/users/me/training-sessions/last-volume?exerciseId=${exercise.exercise.id}`, {
                headers: { Authorization: "Bearer " + accessToken },
              });

              const vol = data.volume;
              tempOldVolumes[exercise.exercise.id] = vol;

              return { [exercise.exercise.id]: vol };
            })
          );

          setOldVolumes({ ...oldVolumes, ...tempOldVolumes });
        } catch (err) {
          const { status } = extractError(err);
          if (status === 404) {
            // create new session
            apiAxios.post("/training-sessions", {}, { headers: { Authorization: "Bearer " + accessToken } }).then((res) => {
              console.log("new session created");
              setTrainingSession(res.data);
            });
          }
        }
      };

      fetchData();
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
          set={{ id: modalData.id, tempId: modalData.tempId, reps: modalData.reps, weight: modalData.weight }}
          editing={modalData.editing}
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
                onAdd={() => setModalData({ exercise: exercise.exercise, id: null, tempId: exercise.sets.length + 1, reps: "", weight: "", editing: false })}
              >
                <LiftTable
                  exercise={exercise.exercise}
                  sets={exercise.sets}
                  onEdit={handleEditSet}
                  onDelete={handleDeleteSet}
                  onExerciseDelete={handleDeleteExercise}
                />
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
