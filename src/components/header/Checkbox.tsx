import React from "react";

interface IProps {
  label: string;
  isChecked: boolean;
  onChange: () => void;
}

export const Checkbox: React.FC<IProps> = ({ label, isChecked, onChange }) => {
  return (
    <label className="ml-4 flex gap-2">
      <input
        type="checkbox"
        className="accent-darkGrey"
        checked={isChecked}
        onChange={onChange}
      />
      {label}
    </label>
  );
};
