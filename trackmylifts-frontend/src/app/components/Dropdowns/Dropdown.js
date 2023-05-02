"use client";

export default function Dropdown({ options = [], onClick }) {
  return (
    <div class="relative">
      {options.length ? (
        <div class="absolute end-0 z-10 mt-2 w-full rounded-md border border-gray-100 bg-white shadow-lg" role="menu">
          <div class="p-2">
            {options.map((option) => {
              return (
                <a
                  key={option.id}
                  href="#"
                  class="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  role="menuitem"
                  onClick={() => onClick(option)}
                >
                  {option.value}
                </a>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
