import { useState, useRef, useEffect } from 'react';
import { Bot, ChevronDown, Sparkles, Languages, Minimize, Maximize, RotateCcw, Wand2, Send, Settings } from 'lucide-react';
import { processTextWithAI } from '../services/openAiService';

const AIFeatures = ({ editor, isSelectionBased = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  
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

  useEffect(() => {
    // Focus the input when custom prompt is shown
    if (showCustomPrompt && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCustomPrompt]);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setShowCustomPrompt(false);
  };
  
  const handleAIAction = async (action) => {
    if (editor) {
      if (isSelectionBased && editor.state.selection.empty) {
        alert('Please select some text first');
        return;
      }
      
      // For selection-based actions
      if (isSelectionBased) {
        const selectedText = editor.state.doc.textBetween(
          editor.state.selection.from, 
          editor.state.selection.to,
          ' '
        );
        
        if (!selectedText) {
          alert('No text selected to process');
          return;
        }
        
        try {
          setIsProcessing(true);
          setIsOpen(false);
          
          // Call the AI processing function for selected text
          const processedText = await processTextWithAI(action, selectedText, true, null, selectedModel);
          
          // Replace just the selected text
          editor
            .chain()
            .focus()
            .deleteSelection()
            .insertContent(processedText)
            .run();
            
        } catch (error) {
          console.error('Error processing with AI:', error);
          alert('An error occurred while processing your text with AI');
        } finally {
          setIsProcessing(false);
        }
      } 
      // For document-level actions
      else {
        try {
          setIsProcessing(true);
          setIsOpen(false);
          
          // Get the current HTML content instead of JSON structure
          const htmlContent = editor.getHTML();
          
          // Also get plain text for context
          const docText = editor.getText();
          
          if (!docText || !htmlContent) {
            alert('No content to process');
            return;
          }
          
          // Call the AI processing function with the HTML content
          const processedHtml = await processTextWithAI(action, docText, false, htmlContent, selectedModel);
          
          // Update the editor content with the processed HTML
          // This preserves structure since we're using HTML directly
          editor.commands.setContent(processedHtml, {
            parseOptions: { preserveWhitespace: 'full' }
          });
          
        } catch (error) {
          console.error('Error processing with AI:', error);
          alert('An error occurred while processing your text with AI');
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  const handleCustomPromptSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!customPrompt.trim()) {
      alert('Please enter a custom prompt');
      return;
    }

    if (editor) {
      try {
        setIsProcessing(true);
        setIsOpen(false);
        
        let textToProcess, htmlContent = null;
        const isSelectionEmpty = editor.state.selection.empty;
        
        // Determine if processing selection or whole document
        if (!isSelectionEmpty && isSelectionBased) {
          textToProcess = editor.state.doc.textBetween(
            editor.state.selection.from, 
            editor.state.selection.to,
            ' '
          );
          
          const processedText = await processTextWithAI('custom_prompt', textToProcess, true, null, selectedModel, customPrompt);
          
          editor
            .chain()
            .focus()
            .deleteSelection()
            .insertContent(processedText)
            .run();
        } else {
          htmlContent = editor.getHTML();
          textToProcess = editor.getText();
          
          const processedHtml = await processTextWithAI('custom_prompt', textToProcess, false, htmlContent, selectedModel, customPrompt);
          
          editor.commands.setContent(processedHtml, {
            parseOptions: { preserveWhitespace: 'full' }
          });
        }

        // Reset custom prompt after submission
        setCustomPrompt('');
        setShowCustomPrompt(false);
        
      } catch (error) {
        console.error('Error processing with custom prompt:', error);
        alert('An error occurred while processing your text with the custom prompt');
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  const actions = isSelectionBased
    ? [
        { id: 'simplify', name: 'Simplify', icon: Wand2, description: 'Make the selected text easier to understand' },
        { id: 'improve', name: 'Improve', icon: Sparkles, description: 'Enhance the writing quality' },
        { id: 'shorten', name: 'Make shorter', icon: Minimize, description: 'Condense the selected text' },
        { id: 'expand', name: 'Make longer', icon: Maximize, description: 'Expand with more details' },
        { id: 'translate', name: 'Translate', icon: Languages, description: 'Translate to another language' },
        { id: 'rewrite', name: 'Rewrite', icon: RotateCcw, description: 'Rewrite in a different style' },
        { id: 'custom', name: 'Custom Prompt', icon: Send, description: 'Use your own custom instruction', onClick: () => setShowCustomPrompt(true) },
      ]
    : [
        { id: 'doc_improve', name: 'Improve entire document', icon: Sparkles, description: 'Enhance the overall writing quality' },
        { id: 'doc_simplify', name: 'Simplify document', icon: Wand2, description: 'Make the document easier to understand' },
        { id: 'doc_shorten', name: 'Summarize document', icon: Minimize, description: 'Create a concise summary' },
        { id: 'doc_proofread', name: 'Proofread & correct', icon: RotateCcw, description: 'Fix grammar and spelling issues' },
        { id: 'doc_translate', name: 'Translate document', icon: Languages, description: 'Translate to another language' },
        { id: 'doc_custom', name: 'Custom Prompt', icon: Send, description: 'Use your own custom instruction', onClick: () => setShowCustomPrompt(true) },
      ];
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`flex items-center justify-center p-2 rounded-md hover:bg-gray-100 gap-1 ${isSelectionBased ? 'text-purple-600' : 'text-gray-600'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={toggleDropdown}
        disabled={isProcessing}
        title={isSelectionBased ? "AI Text Actions" : "AI Document Actions"}
      >
        <Bot className={`w-4 h-4 ${isSelectionBased ? 'text-purple-600' : ''} ${isProcessing ? 'animate-pulse' : ''}`} />
        {!isSelectionBased && <span className="text-sm">AI</span>}
        {!isSelectionBased && <ChevronDown className="w-3 h-3" />}
        {isProcessing && <span className="ml-1 text-xs">Processing...</span>}
      </button>
      
      {isOpen && !isProcessing && (
        <div className={`absolute right-0 ${isSelectionBased ? 'top-full mb-1' : 'top-full mt-1'} z-40 p-2 bg-white rounded-md shadow-lg border border-gray-200 w-64`}>
          <div className="py-1 border-b border-gray-200 mb-2">
            <h3 className="800 text-sm font-medium text-gray-700 px-2 pb-1">
              {isSelectionBased ? 'AI Text Actions' : 'AI Document Actions'}
            </h3>
          </div>

          {/* Model Selection */}
          <div className="px-3 py-2 border-b border-gray-200 mb-2">
            <div className="flex items-center mb-1">
              <Settings className="w-3 h-3 mr-1 text-gray-500" />
              <span className="text-xs font-medium text-gray-700">Model:</span>
            </div>
            <div className="flex gap-2">
              <button
                className={`px-2 py-1 text-xs rounded ${selectedModel === 'openai' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setSelectedModel('openai')}
              >
                OpenAI
              </button>
              <button
                className={`px-2 py-1 text-xs rounded ${selectedModel === 'gemini' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => setSelectedModel('gemini')}
              >
                Gemini
              </button>
            </div>
          </div>

          {/* Custom Prompt Input */}
          {showCustomPrompt ? (
            <div className="px-3 py-2">
              <form onSubmit={handleCustomPromptSubmit} className="flex flex-col gap-2">
                <textarea
                  ref={inputRef}
                  className="w-full p-2 text-sm border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter your instruction..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    onClick={() => setShowCustomPrompt(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" /> Submit
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              {actions.map((action) => (
                <button
                  key={action.id}
                  className="flex items-start w-full px-3 py-2 text-left hover:bg-gray-50 rounded"
                  onClick={() => action.onClick ? action.onClick() : handleAIAction(action.id)}
                >
                  <action.icon className="w-4 h-4 mt-0.5 mr-2 text-purple-600" />
                  <div>
                    <div className="text-gray-800 text-sm font-medium">{action.name}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
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