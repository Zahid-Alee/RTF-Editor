import { useState, useRef, useEffect } from 'react';

// Common fonts list
const FONTS = [
  { name: 'Default', value: '' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Calibri', value: 'Calibri, sans-serif' },
  { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
  { name: 'Courier New', value: '"Courier New", monospace' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Tahoma', value: 'Tahoma, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Fira Code', value: '"Fira Code", monospace' }
];

const FontSelector = ({ onFontSelect, selectedFont }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Find display name for current font
  const getFontDisplayName = (fontValue) => {
    const font = FONTS.find(f => f.value === fontValue);
    return font ? font.name : 'Default';
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleFontSelect = (fontValue) => {
    onFontSelect(fontValue);
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-between w-32 h-8 px-2 py-1 text-sm rounded bg-white border border-gray-300 hover:bg-gray-50"
        onClick={toggleDropdown}
        title="Font Family"
      >
        <span className="truncate" style={{ fontFamily: selectedFont || 'inherit' }}>
          {getFontDisplayName(selectedFont)}
        </span>
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border border-gray-200">
          <ul className="py-1">
            {FONTS.map((font, index) => (
              <li key={index}>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    font.value === selectedFont ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                  style={{ fontFamily: font.value || 'inherit' }}
                  onClick={() => handleFontSelect(font.value)}
                >
                  {font.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FontSelector;