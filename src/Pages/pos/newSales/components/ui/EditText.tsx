import React, { useState } from 'react';

interface EditTextProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'number' | 'email' | 'password';
  disabled?: boolean;
  required?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const EditText: React.FC<EditTextProps> = ({
  placeholder = '',
  value,
  onChange,
  type = 'text',
  disabled = false,
  required = false,
  className = '',
  variant = 'primary'
}) => {
  const [inputValue, setInputValue] = useState(value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const variants = {
    primary: 'bg-primary-blue text-white placeholder-white/70 border-primary-blue focus:ring-primary-blue',
    secondary: 'bg-card text-primary placeholder-secondary border-gray-300 focus:ring-primary-blue focus:border-primary-blue'
  };

  return (
    <input
      type={type}
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={`
        w-full px-3 py-2 sm:px-4 sm:py-3 font-nunito text-sm sm:text-base font-bold
        border rounded-lg transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    />
  );
};

export default EditText;