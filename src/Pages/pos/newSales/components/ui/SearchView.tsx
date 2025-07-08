import React, { useState } from 'react';

interface SearchViewProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  leftImage?: {
    src: string;
    width: number;
    height: number;
  };
  className?: string;
}

const SearchView: React.FC<SearchViewProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  leftImage,
  className = ''
}) => {
  const [searchValue, setSearchValue] = useState(value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        {leftImage && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <img
              src={leftImage.src}
              alt="search"
              className="w-4 h-4 sm:w-5 sm:h-5 text-secondary"
            />
          </div>
        )}
        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={`
            w-full px-3 py-2 sm:px-4 sm:py-3 font-nunito text-sm sm:text-base
            bg-card border border-gray-300 rounded-lg
            text-primary placeholder-secondary
            focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue
            transition-colors duration-200
            ${leftImage ? 'pl-10 sm:pl-12' : ''}
          `.trim().replace(/\s+/g, ' ')}
        />
      </div>
    </form>
  );
};

export default SearchView;