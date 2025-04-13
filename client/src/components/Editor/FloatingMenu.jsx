import { useEffect, useRef } from 'react';
import { BubbleMenu } from '@tiptap/react';
import { useEditor } from '../../hooks/useEditor';

const FloatingMenu = ({ editor }) => {
  const { openLinkModal } = useEditor();
  
  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="bg-white shadow-lg rounded-lg border border-gray-200 z-10 py-1 px-1"
      shouldShow={({ editor, view, state, oldState, from, to }) => {
        // Only show the bubble menu when text is selected
        return from !== to;
      }}
    >
      <div className="flex gap-1">
        <button 
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-blue-50 text-blue-600' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <span className="material-icons text-sm">format_bold</span>
        </button>
        <button 
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-blue-50 text-blue-600' : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="material-icons text-sm">format_italic</span>
        </button>
        <button 
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-blue-50 text-blue-600' : ''}`}
          onClick={openLinkModal}
        >
          <span className="material-icons text-sm">link</span>
        </button>
        <button 
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('code') ? 'bg-blue-50 text-blue-600' : ''}`}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <span className="material-icons text-sm">code</span>
        </button>
      </div>
    </BubbleMenu>
  );
};

export default FloatingMenu;
