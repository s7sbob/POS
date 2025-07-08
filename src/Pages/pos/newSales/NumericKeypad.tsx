import React from 'react';
import Button from './components/ui/Button';

interface NumericKeypadProps {
  onNumberClick: (number: string) => void;
  onClearClick: () => void;
  currentValue: string;
  className?: string;
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onNumberClick,
  onClearClick,
  currentValue,
  className = ''
}) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', 'C'];

  return (
    <section className={`numpad-section ${className}`}>
      <div className="numpad-grid ">
        {numbers.map((key) => (
          <button 
            key={key}
            className="numpad-key"
            onClick={() => key === 'C' ? onClearClick() : onNumberClick(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="numpad-display">{currentValue}</div>
    </section>
  );
};

export default NumericKeypad;
