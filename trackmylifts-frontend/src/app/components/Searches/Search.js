"use client";

import { TextField } from "../Inputs";
import { Dropdown } from "../Dropdowns";

export default function Search({ value, onChange, options, onAutocomplete }) {

  const handleItemClicked = (option) => {
    onAutocomplete(option);
  };

  return (
    <div>
      <TextField value={value} onChange={onChange} />
      <Dropdown options={options} onClick={handleItemClicked} />
    </div>
  );
}
