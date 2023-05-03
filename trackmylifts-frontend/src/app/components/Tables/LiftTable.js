"use client";

import { RxCross1 } from "react-icons/rx";
import { FiEdit2 } from "react-icons/fi";

export default function LiftTable({ exercise, sets = [], onEdit, onDelete, onExerciseDelete }) {
  return (
    <div className="overflow-x-auto">
      <div className="absolute btn btn-circle btn-error z-10 right-0" onClick={() => onExerciseDelete(exercise)}>
        <RxCross1 />
      </div>
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th>Set</th>
            <th>Reps</th>
            <th>Weight (kg)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {sets.map((set, i) => {
            return (
              <tr key={i}>
                <th>{i + 1}</th>
                <td>{set.reps}</td>
                <td>{set.weight}</td>
                <td>
                  <button className="btn btn-primary btn-circle" onClick={() => onEdit({ exercise, index: i, ...set })}>
                    <FiEdit2 />
                  </button>
                  <button className="ml-2 btn btn-circle btn-error" onClick={() => onDelete({ exercise, index: i, ...set })}>
                    <RxCross1 />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
