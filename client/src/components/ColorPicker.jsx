import { useState, useRef, useEffect } from 'react';
import { Paintbrush, Highlighter } from 'lucide-react';

// Predefined color palette
const COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#E03131', // Red
  '#2B8A3E', // Green
  '#1971C2', // Blue
  '#F08C00', // Orange
  '#5F3DC4', // Purple
  '#0B7285', // Teal
  '#F06595', // Pink
  '#F1C40F', // Yellow
  '#74C0FC', // Light blue
  '#B2F2BB', // Light green
  '#FFD8A8', // Light orange
  '#D0BFFF', // Light purple
  '#FF8787', // Light red
  '#FCC419', // Gold
  '#4C6EF5', // Indigo
  '#AE3EC9', // Magenta
  '#495057', // Dark gray
  '#CED4DA', // Light gray
];

const ColorPicker = ({ selectedColor, onColorSelect, title = 'Color' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(selectedColor || '#000000');
  const dropdownRef = useRef(null);
  const isTextColor = title.toLowerCase().includes('text');
  
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
  
  const handleColorSelect = (color) => {
    onColorSelect(color);
    setCustomColor(color);
    setIsOpen(false);
  };
  
  const handleCustomColorChange = (e) => {
    setCustomColor(e.target.value);
  };
  
  const handleCustomColorApply = () => {
    onColorSelect(customColor);
    setIsOpen(false);
  };
  
  const Icon = isTextColor ? Paintbrush : Highlighter;
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="p-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-center"
        onClick={toggleDropdown}
        title={title}
        style={{ color: isTextColor ? selectedColor : 'inherit' }}
      >
        <Icon 
          className="w-4 h-4" 
          style={!isTextColor ? { color: selectedColor } : {}} 
        />
      </button>
      
      {isOpen && (
        <div className="absolute z-20 mt-1 p-3 bg-white rounded-md shadow-lg border border-gray-200 w-60">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
          
          <div className="grid grid-cols-5 gap-2 mb-3">
            {COLORS.map((color, index) => (
              <button
                key={index}
                type="button"
                className={`w-8 h-8 rounded-md border ${
                  color === selectedColor
                    ? 'border-blue-500 ring-2 ring-blue-300'
                    : 'border-gray-300 hover:border-gray-400'
                } ${color === '#FFFFFF' ? 'bg-[url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIElEQVQYV2NkYGAwZsAEZ9GFGIeIQix+wfQgyDODXSEAZwoFAcBtF7UAAAAASUVORK5CYII=")] bg-repeat' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}
          </div>
          
          <div className="mt-3 flex flex-col">
            <h4 className="text-xs font-medium text-gray-600 mb-1">Custom Color</h4>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-10 h-8 p-0 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="flex-1 border border-gray-300 rounded p-1 text-sm"
                maxLength={7}
              />
              <button
                type="button"
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                onClick={handleCustomColorApply}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;