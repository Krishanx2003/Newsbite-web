import React, { ChangeEvent } from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value?: string; // Make value optional since file inputs don't use it
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  accept?: string; // Add accept prop for file inputs
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  accept,
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 dark:text-gray-300 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
      required={required}
      accept={accept} // Pass the accept prop to the input element
    />
  </div>
);

export default InputField;