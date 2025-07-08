import React, { useState } from 'react';

interface ChipItemProps {
  children: React.ReactNode;
  leftImage?: {
    src: string;
    width: number;
    height: number;
  };
  selected?: boolean;
  onClick?: () => void;
  variant?: 'extra' | 'without' | 'offer';
  className?: string;
}

interface ChipViewProps {
  children: React.ReactNode;
  className?: string;
}

const ChipItem: React.FC<ChipItemProps> = ({
  children,
  leftImage,
  selected = false,
  onClick,
  variant = 'extra',
  className = ''
}) => {
  const variants = {
    extra: 'bg-primary-green text-white',
    without: 'bg-primary-red text-white',
    offer: 'bg-primary-orange text-white'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-nunito text-sm sm:text-base font-medium
        transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
        ${variants[variant]}
        ${selected ? 'ring-2 ring-offset-2 ring-current' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {leftImage && (
        <img
          src={leftImage.src}
          alt=""
          className="w-4 h-4 sm:w-6 sm:h-6"
        />
      )}
      {children}
    </button>
  );
};

const ChipView: React.FC<ChipViewProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 sm:gap-4 ${className}`}>
      {children}
    </div>
  );
};

export { ChipView, ChipItem };
export default ChipView;