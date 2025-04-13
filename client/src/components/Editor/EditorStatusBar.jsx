import { useEffect, useState } from 'react';
import { useEditor } from '../../hooks/useEditor';

const EditorStatusBar = () => {
  const { editor, saveContent, lastSaved } = useEditor();
  const [wordCount, setWordCount] = useState({ words: 0, characters: 0 });
  const [saveStatus, setSaveStatus] = useState('Saved');

  // Update word count when editor changes
  useEffect(() => {
    if (!editor) return;

    const updateWordCount = () => {
      const text = editor.getText();
      
      // Count words (split by whitespace)
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      
      // Count characters (excluding whitespace)
      const characters = text.replace(/\s/g, '').length;
      
      setWordCount({ words, characters });
    };

    // Initial count
    updateWordCount();
    
    // Subscribe to changes
    editor.on('update', updateWordCount);
    
    return () => {
      editor.off('update', updateWordCount);
    };
  }, [editor]);

  // Handle manual save
  const handleSave = () => {
    setSaveStatus('Saving...');
    saveContent();
    setSaveStatus('Saved');
  };

  // Format last saved time
  const getLastSavedText = () => {
    if (!lastSaved) return 'Not saved yet';
    
    // Format the timestamp
    const now = new Date();
    const saved = new Date(lastSaved);
    
    // If saved today, show time
    if (now.toDateString() === saved.toDateString()) {
      return `Saved at ${saved.toLocaleTimeString()}`;
    }
    
    // Otherwise show date and time
    return `Saved on ${saved.toLocaleDateString()} at ${saved.toLocaleTimeString()}`;
  };

  return (
    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-4">
        <span>Words: {wordCount.words}</span>
        <span>Characters: {wordCount.characters}</span>
      </div>
      <div>
        <button 
          onClick={handleSave}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          <span className="flex items-center gap-1">
            <span className="material-icons text-base">save</span> 
            <span>{saveStatus}</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default EditorStatusBar;
