"use client";

import classNames from "classnames";
import { useState } from "react";

export default function AddSetModal({ exercise, set = { id: "", reps: "", weight: "" }, onSave, onCancel }) {
  const [data, setData] = useState(set);

  const handleSave = () => {
    if (data.reps && data.weight) onSave({ exercise, set: data });
  };

  return (
    <div>
      {/* The button to open modal */}
      {/* <label htmlhtmlFor="my-modal" className="btn" onClick={(e) => console.log("cl", e.target)}>
        open modal
      </label> */}

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className={classNames("modal", { "modal-open": exercise })}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{exercise.name}</h3>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <h4 className="font-bold">Sets</h4>
              <input type="number" placeholder="" className="input input-bordered input-accent w-full max-w-xs" disabled={true} value={data.id} />
            </div>
            <div className="flex items-center gap-4">
              <h4 className="font-bold">Reps</h4>
              <input
                type="number"
                placeholder="Type here"
                className="input input-bordered input-accent w-full max-w-xs"
                value={data.reps}
                onChange={(e) => setData({ ...data, reps: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-4">
              <h4 className="font-bold">Weight (in kg)</h4>
              <input
                type="number"
                placeholder="Type here"
                className="input input-bordered input-accent w-full max-w-xs"
                value={data.weight}
                onChange={(e) => setData({ ...data, weight: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-action">
            <button className="btn btn-primary" onClick={onCancel}>
              Cancel
            </button>

            <label htmlhtmlFor="my-modal" className="btn" onClick={handleSave}>
              Save Changes
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
