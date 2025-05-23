import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Type } from 'lucide-react';

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

// Group fonts by category
const FONT_CATEGORIES = [
  {
    name: 'Sans-serif',
    fonts: FONTS.filter(font => 
      font.value.includes('sans-serif') && 
      !font.value.includes('monospace') && 
      !font.value.includes('cursive')
    )
  },
  {
    name: 'Serif',
    fonts: FONTS.filter(font => 
      font.value.includes('serif') && 
      !font.value.includes('sans-serif')
    )
  },
  {
    name: 'Monospace',
    fonts: FONTS.filter(font => 
      font.value.includes('monospace')
    )
  },
  {
    name: 'Other',
    fonts: [
      FONTS[0], // Default
      ...FONTS.filter(font => 
        font.value.includes('cursive') ||
        (!font.value.includes('sans-serif') && 
         !font.value.includes('serif') && 
         !font.value.includes('monospace') &&
         font.value !== '') // exclude Default font
      )
    ]
  }
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
        className="flex items-center justify-between h-8 px-2 py-1 text-sm rounded bg-white border border-gray-300 hover:bg-gray-50 gap-1 min-w-[140px] max-w-[160px]"
        onClick={toggleDropdown}
        title="Font Family"
      >
        <Type className="w-4 h-4 text-gray-500" />
        <span className="truncate" style={{ fontFamily: selectedFont || 'inherit' }}>
          {getFontDisplayName(selectedFont)}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="absolute z-30 mt-1 w-64 bg-white rounded-md shadow-lg max-h-80 overflow-y-auto border border-gray-200">
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-3 py-2">
            <h3 className="text-xs font-medium text-gray-700">Font Family</h3>
          </div>
          
          <div className="py-1">
            {FONT_CATEGORIES.map((category, catIndex) => (
              <div key={catIndex} className="mb-2">
                <h4 className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                  {category.name}
                </h4>
                <ul>
                  {category.fonts.map((font, fontIndex) => (
                    <li key={`${catIndex}-${fontIndex}`}>
                      <button
                        type="button"
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          font.value === selectedFont ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSelector;