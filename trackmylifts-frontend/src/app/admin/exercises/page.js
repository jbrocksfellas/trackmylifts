"use client";
import { TextField } from "../../components/Inputs";
import { Collapse } from "../../components/Collapses";
import { Table } from "../../components/Tables";
import { AddExerciseModal } from "../../components/Modals";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { apiAxios } from "../../utils/api.util";
import classNames from "classnames";
import toast from "../../utils/toast.util";
import { extractError } from "../../utils/error.util";

export default function Page() {
  const [modalData, setModalData] = useState(null);
  const [modalEditing, setModalEditing] = useState(false);
  const [sureDeleteExericiseModal, setSureDeleteExericiseModal] = useState(null);
  const [exercises, setExercises] = useState([]);
  const { accessToken } = useAuth();

  const handleCancelModal = () => {
    setModalEditing(false);
    setModalData(null);
  };

  const handleSaveExercise = async (data) => {
    const { exercise, editing } = data;
    try {
      if (editing) {
        // update exercise in backend
        await apiAxios.put(`/exercises/${exercise.id}`, { name: exercise.name, tags: exercise.tags }, { headers: { Authorization: "Bearer " + accessToken } });

        // update exercise in ui
        const newExercises = [...exercises];
        const exerciseIndex = newExercises.findIndex((innerExercise) => innerExercise.id === exercise.id);
        if (exerciseIndex !== -1) {
          newExercises[exerciseIndex] = exercise;
        }
        setExercises(newExercises);
      } else {
        const { data: newExercise } = await apiAxios.post(
          "/exercises",
          { name: exercise.name, tags: exercise.tags },
          { headers: { Authorization: "Bearer " + accessToken } }
        );
        setExercises([newExercise, ...exercises]);
      }
      setModalEditing(false);
      setModalData(null);
    } catch (err) {
      const { status, message } = extractError(err);
      toast.error("Exercise is already present");
    }
  };

  const handleAddExerciseButton = () => {
    setModalData({ id: 1, name: "", tags: [] });
  };

  const handleEditExercise = (exercise) => {
    setModalEditing(true);
    setModalData(exercise);
  };

  const handleDeleteExercise = async (exercise) => {
    // open delete sure modal
    setSureDeleteExericiseModal(exercise);
  };

  const handleConfirmDeleteExercise = async () => {
    const exercise = sureDeleteExericiseModal;

    await apiAxios.delete(`/exercises/${exercise.id}`, { headers: { Authorization: "Bearer " + accessToken } });

    setExercises(exercises.filter((innerExercise) => innerExercise.id !== exercise.id));
    setSureDeleteExericiseModal(false);
  };

  const getExerciseActions = (exercise) => {
    return (
      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={() => handleEditExercise(exercise)}>
          Edit
        </button>
        <button className="btn btn-error" onClick={() => handleDeleteExercise(exercise)}>
          Delete
        </button>
      </div>
    );
  };

  const handleNotDeleteExercise = () => {
    setSureDeleteExericiseModal(null);
  };

  useEffect(() => {
    if (accessToken) {
      const fetchData = async () => {
        try {
          // find training session
          const { data: fetchedExercises } = await apiAxios.get("/exercises", {
            headers: { Authorization: "Bearer " + accessToken },
          });
          setExercises(fetchedExercises.exercises);
        } catch (err) {}
      };

      fetchData();
    }
  }, [accessToken]);

  return (
    <div>
      {modalData && <AddExerciseModal exercise={modalData} editing={modalEditing} onSave={handleSaveExercise} onCancel={handleCancelModal} />}

      {sureDeleteExericiseModal && <DeleteModal exercise={sureDeleteExericiseModal} onYes={handleConfirmDeleteExercise} onNo={handleNotDeleteExercise} />}

      <div className="px-4">
        <div className="max-w-[300px] mx-auto mt-10 mb-5 text-center">
          <button className="btn btn-primary" onClick={handleAddExerciseButton}>
            Add exercise
          </button>
        </div>

        {/* <div className="px-4 py-2 grid [grid-template-columns:2fr_1fr_1fr;] border border-primary rounded-xl">
          <div>s</div>
          <div className="flex gap-2 flex-wrap">
            {["chest", "back", "shoulder", "legs", "abs", "calves", "forearms"].map((tag, i) => {
              return <Badge key={i} value={tag} />;
            })}
          </div>
        </div> */}
      </div>
      {exercises && (
        <Table
          headings={["Exercise", "Actions"]}
          rows={exercises.map((exercise) => {
            return [exercise.name, getExerciseActions(exercise)];
          })}
        />
      )}
    </div>
  );
}

const DeleteModal = ({ exercise, onYes, onNo }) => {
  return (
    <div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className={classNames("modal", { "modal-open": exercise })}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure you want to delete?</h3>

          {/* <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <h4 className="font-bold">Sets</h4>
              <input type="number" placeholder="" className="input input-bordered input-accent w-full max-w-xs" disabled={true} value={data.tempId} />
            </div>
          </div> */}

          <div className="modal-action">
            <button className="btn btn-error" onClick={onNo}>
              No
            </button>

            <button className="btn btn-primary" onClick={onYes}>
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
