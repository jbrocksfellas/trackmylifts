"use client";

export default function TextField({ value, placeholder = "Search exercise", onChange }) {
  return (
    <div className="relative">
      <label htmlFor="UserEmail" className="sr-only">
        {" "}
        Email{" "}
      </label>

      <input
        type="email"
        id="UserEmail"
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-200 pe-10 px-4 py-2 shadow-sm sm:text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
