// import React from 'react';

// interface NumericKeypadProps {
//   onNumberClick: (number: string) => void;
//   onClearClick: () => void;
//   currentValue: string;
//   className?: string;
// }

// const NumericKeypad: React.FC<NumericKeypadProps> = ({
//   onNumberClick,
//   onClearClick,
//   currentValue,
//   className = ''
// }) => {
//   const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', 'C'];

//   return (
//     <div className={`numeric-keypad ${className}`}>
//       <div className="keypad-grid">
//         {numbers.map((key) => (
//           <button 
//             key={key}
//             className="keypad-key"
//             onClick={() => key === 'C' ? onClearClick() : onNumberClick(key)}
//           >
//             {key}
//           </button>
//         ))}
//       </div>
//       <div className="keypad-display">
//         {currentValue}
//       </div>
//     </div>
//   );
// };

// export default NumericKeypad;
