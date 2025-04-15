import { useState, useRef, useEffect } from 'react';
import { Bot, ChevronDown, Sparkles, Languages, Minimize, Maximize, RotateCcw, Wand2 } from 'lucide-react';

const AIFeatures = ({ onAIAction, editor, isSelectionBased = false }) => {
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
  
  const handleAIAction = (action) => {
    if (editor) {
      if (isSelectionBased && editor.state.selection.empty) {
        alert('Please select some text first');
        return;
      }
      
      const selectedText = isSelectionBased 
        ? editor.state.doc.textBetween(
            editor.state.selection.from, 
            editor.state.selection.to,
            ' '
          )
        : editor.getText();
      
      if (selectedText) {
        onAIAction(action, selectedText, isSelectionBased);
      } else {
        alert('No text to process');
      }
    }
    
    setIsOpen(false);
  };
  
  const actions = isSelectionBased
    ? [
        { id: 'simplify', name: 'Simplify', icon: Wand2, description: 'Make the selected text easier to understand' },
        { id: 'improve', name: 'Improve', icon: Sparkles, description: 'Enhance the writing quality' },
        { id: 'shorten', name: 'Make shorter', icon: Minimize, description: 'Condense the selected text' },
        { id: 'expand', name: 'Make longer', icon: Maximize, description: 'Expand with more details' },
        { id: 'translate', name: 'Translate', icon: Languages, description: 'Translate to another language' },
        { id: 'rewrite', name: 'Rewrite', icon: RotateCcw, description: 'Rewrite in a different style' },
      ]
    : [
        { id: 'doc_improve', name: 'Improve entire document', icon: Sparkles, description: 'Enhance the overall writing quality' },
        { id: 'doc_simplify', name: 'Simplify document', icon: Wand2, description: 'Make the document easier to understand' },
        { id: 'doc_shorten', name: 'Summarize document', icon: Minimize, description: 'Create a concise summary' },
        { id: 'doc_proofread', name: 'Proofread & correct', icon: RotateCcw, description: 'Fix grammar and spelling issues' },
        { id: 'doc_translate', name: 'Translate document', icon: Languages, description: 'Translate to another language' },
      ];
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`flex items-center justify-center p-2 rounded-md hover:bg-gray-100 gap-1 ${isSelectionBased ? 'text-purple-600' : 'text-gray-600'}`}
        onClick={toggleDropdown}
        title={isSelectionBased ? "AI Text Actions" : "AI Document Actions"}
      >
        <Bot className={`w-4 h-4 ${isSelectionBased ? 'text-purple-600' : ''}`} />
        {!isSelectionBased && <span className="text-sm">AI</span>}
        {!isSelectionBased && <ChevronDown className="w-3 h-3" />}
      </button>
      
      {isOpen && (
        <div className={`absolute ${isSelectionBased ? 'bottom-full mb-1' : 'top-full mt-1'} z-40 p-2 bg-white rounded-md shadow-lg border border-gray-200 w-64`}>
          <div className="py-1 border-b border-gray-200 mb-2">
            <h3 className="text-sm font-medium text-gray-700 px-2 pb-1">
              {isSelectionBased ? 'AI Text Actions' : 'AI Document Actions'}
            </h3>
          </div>
          <div>
            {actions.map((action) => (
              <button
                key={action.id}
                className="flex items-start w-full px-3 py-2 text-left hover:bg-gray-50 rounded"
                onClick={() => handleAIAction(action.id)}
              >
                <action.icon className="w-4 h-4 mt-0.5 mr-2 text-purple-600" />
                <div>
                  <div className="text-sm font-medium">{action.name}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500 px-3 italic">
              Processing with AI may take a moment
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIFeatures;