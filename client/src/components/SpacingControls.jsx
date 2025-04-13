import { useState, useRef, useEffect } from 'react';
import { AlignJustify, ArrowRightLeft, MoveHorizontal } from 'lucide-react';

const SpacingOption = ({ icon: Icon, label, value, onChange, min, max, step }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
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
  
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100"
        onClick={toggleDropdown}
        title={label}
      >
        <Icon className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 p-3 bg-white rounded-md shadow-lg w-60 border border-gray-200">
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <span className="text-sm text-gray-500">{value}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[min, (max - min) / 2 + min, max].map((preset, i) => (
              <button
                key={i}
                type="button"
                className={`py-1 px-2 text-xs rounded ${
                  Number(value) === preset
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
                onClick={() => onChange(preset)}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SpacingControls = ({ 
  onLineHeightChange, 
  onLetterSpacingChange, 
  onWordSpacingChange,
  lineHeight = 1.5,
  letterSpacing = 0,
  wordSpacing = 0
}) => {
  return (
    <div className="flex items-center">
      <SpacingOption
        icon={AlignJustify}
        label="Line Height"
        value={lineHeight}
        onChange={onLineHeightChange}
        min={1}
        max={3}
        step={0.1}
      />
      
      <SpacingOption
        icon={MoveHorizontal}
        label="Letter Spacing"
        value={letterSpacing}
        onChange={onLetterSpacingChange}
        min={-0.1}
        max={0.5}
        step={0.01}
      />
      
      <SpacingOption
        icon={ArrowRightLeft}
        label="Word Spacing"
        value={wordSpacing}
        onChange={onWordSpacingChange}
        min={0}
        max={3}
        step={0.1}
      />
    </div>
  );
};

export default SpacingControls;