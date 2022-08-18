import React from "react";

interface IProps {
  label: string;
  value: boolean;
  onChange: () => void;
}

export const Checkbox: React.FC<IProps> = ({ label, value, onChange }) => {
  return (
    <label className="ml-4 flex gap-2">
      <input type="checkbox" checked={value} onChange={onChange} />
      {label}
    </label>
  );
};
