"use client";

export default function Collapse({ id, label = "Click me", children, onAdd }) {
  return (
    <div className="collapse bg-slate-50">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        {id}. {label}
      </div>

      <div className="collapse-content">
        {children}
        <button class="ml-auto my-2 bg-green-500 hover:bg-green-600 rounded-full w-6 h-6 flex items-center justify-center" onClick={onAdd}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a1 1 0 0 1-1-1V11H4a1 1 0 1 1 0-2h5V4a1 1 0 1 1 2 0v5h5a1 1 0 1 1 0 2h-5v6a1 1 0 0 1-1 1z" clip-rule="evenodd" onClick={onAdd} />
          </svg>
        </button>
      </div>
    </div>
  );
}
