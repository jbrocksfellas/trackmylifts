"use client";
import classNames from "classnames";
import { PercentageUpIcon, PercentageDownIcon } from "../../components/Icons";
import { useMemo } from "react";

export default function Collapse({ id, label = "Click me", children, onAdd, onDelete, newVolume = 0, oldVolume = 0 }) {
  const percentage = useMemo(() => {
    if (oldVolume === 0) return 0;

    const newPercentage = (newVolume * 100) / oldVolume;

    console.log(newPercentage, oldVolume, newVolume);

    if (isNaN(newPercentage)) return 0;

    const diff = newPercentage - 100;

    if (diff === 0) return 0;

    return diff.toFixed(1);
  }, [oldVolume, newVolume]);

  return (
    <div className="collapse bg-slate-50">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        {id}. {label}
      </div>

      <div className="mx-2 mb-2 absolute right-0">
        <h3 className="flex">
          Vol: <span className={classNames("ml-2", { "text-success": percentage >= 0 }, { "text-error": percentage < 0 })}>{percentage}% </span>
          {percentage >= 0 ? <PercentageUpIcon /> : <PercentageDownIcon />}
        </h3>
      </div>

      <div className="collapse-content">
        {children}
        <div className="flex justify-between mx-4 mt-4">
          <button className="bg-green-500 hover:bg-green-600 rounded-full w-6 h-6 flex items-center justify-center" onClick={onAdd}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a1 1 0 0 1-1-1V11H4a1 1 0 1 1 0-2h5V4a1 1 0 1 1 2 0v5h5a1 1 0 1 1 0 2h-5v6a1 1 0 0 1-1 1z"
                clipRule="evenodd"
                onClick={onAdd}
              />
            </svg>
          </button>
          <button className="bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 flex items-center justify-center rotate-45" onClick={onDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a1 1 0 0 1-1-1V11H4a1 1 0 1 1 0-2h5V4a1 1 0 1 1 2 0v5h5a1 1 0 1 1 0 2h-5v6a1 1 0 0 1-1 1z"
                clipRule="evenodd"
                onClick={onAdd}
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
