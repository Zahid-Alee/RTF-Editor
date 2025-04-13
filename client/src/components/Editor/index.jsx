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

const Editor = () => {
  const { editor, lastSaved } = useEditor();
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
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
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
        </div>
      </header>
      
      {/* Editor Toolbar */}
      <EditorToolbar />
      
      {/* Main Editor Area */}
      <div className="flex-1 overflow-auto bg-white p-4 sm:p-6">
        <div className="mx-auto max-w-4xl bg-white rounded-lg shadow-sm border border-gray-100">
          <EditorContent />
        </div>
      </div>
      
      {/* Footer with word count */}
      <footer className="border-t border-gray-200 bg-gray-50 py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount} {charCount === 1 ? 'character' : 'characters'}
          </div>
          <EditorFooterMenu />
        </div>
      </footer>
      
      {/* Modals */}
      <ImageDialog />
      <EmojiPicker />
      <TableSettingsModal />
      <CodeBlockModal />
      <LinkModal />
      <KeyboardShortcutsModal />
    </div>
  );
};

export default Editor;