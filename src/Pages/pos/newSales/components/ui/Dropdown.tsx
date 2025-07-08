import React, { useState } from 'react';

interface DropdownProps {
  placeholder?: string;
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
  rightImage?: {
    src: string;
    width: number;
    height: number;
  };
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  placeholder = 'Select option',
  options = ['Option 1', 'Option 2', 'Option 3'],
  value,
  onChange,
  rightImage,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || placeholder);

  const handleSelect = (option: string) => {
    setSelectedValue(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-1 text-left rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-colors duration-200"
      >
        <span className="font-nunito text-sm sm:text-base text-primary truncate">
          {selectedValue}
        </span>
        {rightImage && (
          <img
            src={rightImage.src}
            alt="dropdown arrow"
            className={`w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-auto">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full px-3 py-2 text-left font-nunito text-sm sm:text-base text-primary hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;