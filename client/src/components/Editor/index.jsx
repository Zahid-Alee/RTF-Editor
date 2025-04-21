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
    <div className={`flex max-w-full flex-col mx-auto ${isFullscreenMode ? 'fixed inset-0 z-50 bg-white' : 'h-screen max-h-screen'} overflow-hidden`}>
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
              className="p-2 rounded-md flex items-center gap-1 text-gray-700 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              title="Generate with AI"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-wand-sparkles w-4 h-4 mt-0.5 mr-2 text-purple-600"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"></path><path d="m14 7 3 3"></path><path d="M5 6v4"></path><path d="M19 14v4"></path><path d="M10 2v2"></path><path d="M7 8H3"></path><path d="M21 16h-4"></path><path d="M11 3H9"></path></svg>
              Generate

            </button>
            <button
              onClick={togglePreviewMode}
              className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${isPreviewMode ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'
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

      <div className="flex-1 overflow-auto bg-white">
        <div className={'max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100'}>
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