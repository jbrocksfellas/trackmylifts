"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import { Badge } from "../Badges";

export default function AddExerciseModal({ exercise, editing = false, onSave, onCancel }) {
  const [data, setData] = useState(exercise);
  const [tag, setTag] = useState("");

  const handleRemoveTag = (tag) => {
    console.log("haha");
    setData({ ...data, tags: data.tags.filter((innerTag) => innerTag !== tag) });
  };

  const handleSave = () => {
    if (data.name && data.tags.length > 0) {
      onSave({ exercise: data, editing });
    }
  };

  const handleAddTag = (e) => {
    if (e.keyCode === 13) {
      setData({ ...data, tags: [...data.tags, tag] });
      setTag("");
    }
  };

  console.log(exercise);

  return (
    <Modal show={exercise}>
      <h3 className="font-bold text-lg">Exercise</h3>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h4 className="font-bold">Name</h4>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-accent w-full max-w-xs"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-4">
          <h4 className="font-bold">Add Tag</h4>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-accent w-full max-w-xs"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={handleAddTag}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-wrap gap-1">
            {data.tags.map((tag, i) => (
              <Badge key={i} value={tag} onRemove={() => handleRemoveTag(tag)} />
            ))}
          </div>
        </div>
      </div>

      <div className="modal-action">
        <button className="btn" onClick={onCancel}>
          Cancel
        </button>

        <label htmlFor="my-modal" className="btn btn-primary" onClick={handleSave}>
          Save Changes
        </label>
      </div>
    </Modal>
  );
}
