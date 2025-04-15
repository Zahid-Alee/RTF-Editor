import { useState, useEffect } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { formatDate } from '../../lib/utils.jsx';
import EditorToolbar from './EditorToolbar';
import EditorContent from './EditorContent';
import EditorFooterMenu from './EditorFooterMenu';
import ImageDialog from '../Modals/ImageDialog';
import EmojiPicker from '../Modals/EmojiPicker';
import TableSettingsModal from '../Modals/TableSettingsModal';
import CodeBlockModal from '../Modals/CodeBlockModal';
import LinkModal from '../Modals/LinkModal';
import KeyboardShortcutsModal from '../Modals/KeyboardShortcutsModal';
import ImagePropertiesModal from '../Modals/ImagePropertiesModal';
import AIGeneratorModal from '../Modals/AIGeneratorModal';
import { Maximize2, Minimize2, Eye, Edit, Cpu } from 'lucide-react';

const Editor = () => {
  const { 
    editor, 
    lastSaved,
    isFullscreenMode,
    toggleFullscreen,
    isPreviewMode,
    togglePreviewMode,
    isAiGeneratorOpen,
    openAiGenerator,
    closeAiGenerator,
    handleAiGenerate
  } = useEditor();
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Update counts when editor content changes
  useEffect(() => {
    if (!editor) return;

    const updateCounts = () => {
      // Get plain text from editor
      const text = editor.getText();
      
      // Count words by splitting on whitespace
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
      
      // Count characters
      setCharCount(text.length);
    };

    // Subscribe to changes
    editor.on('update', updateCounts);
    
    // Initial count
    updateCounts();
    
    // Cleanup
    return () => {
      editor.off('update', updateCounts);
    };
  }, [editor]);

  return (
    <div className={`flex flex-col ${isFullscreenMode ? 'fixed inset-0 z-50 bg-white' : 'h-screen max-h-screen'} overflow-hidden`}>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white py-3 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rich Text Editor</h1>
            {lastSaved && (
              <p className="text-xs text-gray-500 mt-1">
                Last saved: {formatDate(lastSaved)}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={openAiGenerator}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title="Generate with AI"
            >
              <Cpu className="h-5 w-5" />
            </button>
            
            <button
              onClick={togglePreviewMode}
              className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${
                isPreviewMode ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'
              }`}
              title={isPreviewMode ? "Switch to Edit Mode" : "Switch to Preview Mode"}
            >
              {isPreviewMode ? (
                <Edit className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title={isFullscreenMode ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreenMode ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>
      
      {!isPreviewMode && <EditorToolbar />}
      
      <div className="flex-1 overflow-auto bg-white p-4 sm:p-6">
        <div className={`${isFullscreenMode ? 'max-w-6xl' : 'max-w-4xl'} mx-auto bg-white rounded-lg shadow-sm border border-gray-100`}>
          <EditorContent />
        </div>
      </div>
      
      <footer className="border-t border-gray-200 bg-gray-50 py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount} {charCount === 1 ? 'character' : 'characters'}
          </div>
          <EditorFooterMenu />
        </div>
      </footer>
      
      <ImageDialog />
      <EmojiPicker />
      <TableSettingsModal />
      <CodeBlockModal />
      <LinkModal />
      <KeyboardShortcutsModal />
      <ImagePropertiesModal />
      <AIGeneratorModal 
        isOpen={isAiGeneratorOpen} 
        onClose={closeAiGenerator} 
        onGenerate={handleAiGenerate} 
      />
    </div>
  );
};

export default Editor;