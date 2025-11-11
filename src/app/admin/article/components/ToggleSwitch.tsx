// components/ToggleSwitch.tsx
import React from "react";

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: () => void; // Changed from onToggle for clarity
  label: string;
  onLabel?: string;
  offLabel?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn,
  handleToggle,
  label,
  onLabel = "On",
  offLabel = "Off",
}) => {
  // Generate a unique ID for each instance of the component
  const id = React.useId();
  const toggleId = `toggle-${id}`;

  return (
    <div className="mb-4">
      <label className="block text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex items-center">
        <div className="relative inline-block w-16 mr-2 align-middle select-none">
          <input
            type="checkbox"
            id={toggleId}
            checked={isOn}
            onChange={handleToggle}
            className="sr-only"
          />
          <label
            htmlFor={toggleId}
            className={`block overflow-hidden h-8 rounded-full cursor-pointer transition-colors duration-200 ${isOn ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"
              }`}
          >
            <span
              className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 transform ${isOn ? "translate-x-8" : "translate-x-0"
                }`}
            >
              <span className="sr-only">
                {isOn ? onLabel : offLabel}
              </span>
            </span>
          </label>
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {isOn ? onLabel : offLabel}
        </span>
      </div>
    </div>
  );
};

export default ToggleSwitch;