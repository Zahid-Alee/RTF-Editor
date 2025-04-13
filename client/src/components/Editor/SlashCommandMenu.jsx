import { useCallback, useEffect, useState, useRef } from 'react';
import { useEditor } from '../../hooks/useEditor';

const SlashCommandMenu = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);
  const { openImageDialog } = useEditor();

  const handleSlashCommand = useCallback((e) => {
    if (!editor || e.key !== '/') return;
    
    // Get the current position of the slash
    const { view } = editor;
    const { state } = view;
    const { selection } = state;
    const { $anchor } = selection;
    
    // Get coordinates
    const coords = view.coordsAtPos($anchor.pos);
    
    // Position the menu below the slash
    setPosition({
      x: coords.left,
      y: coords.bottom + window.scrollY + 10,
    });
    
    setIsOpen(true);
  }, [editor]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleClickOutside = useCallback((e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      closeMenu();
    }
  }, [closeMenu]);

  useEffect(() => {
    if (!editor) return;
    
    // Listen for keydown events
    const editorElement = editor.view.dom;
    editorElement.addEventListener('keydown', handleSlashCommand);
    
    // Listen for clicks outside
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      editorElement.removeEventListener('keydown', handleSlashCommand);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editor, handleSlashCommand, handleClickOutside]);

  if (!editor || !isOpen) {
    return null;
  }

  const insertParagraph = () => {
    editor.chain().focus().setParagraph().run();
    closeMenu();
  };

  const insertHeading = () => {
    editor.chain().focus().toggleHeading({ level: 2 }).run();
    closeMenu();
  };

  const insertBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
    closeMenu();
  };

  const insertImage = () => {
    openImageDialog();
    closeMenu();
  };

  return (
    <div 
      ref={menuRef}
      className="bg-white shadow-lg rounded-lg border border-gray-200 absolute z-10 py-2 px-0" 
      style={{ 
        top: `${position.y}px`, 
        left: `${position.x}px`,
        display: isOpen ? 'block' : 'none'
      }}
    >
      <div className="px-3 py-1 text-sm text-gray-500 font-medium">Basic blocks</div>
      <button 
        className="flex items-center gap-2 px-3 py-1.5 w-full text-left hover:bg-gray-100"
        onClick={insertParagraph}
      >
        <span className="material-icons text-gray-600">text_fields</span>
        <div>
          <div className="text-sm font-medium">Text</div>
          <div className="text-xs text-gray-500">Just start writing with plain text.</div>
        </div>
      </button>
      <button 
        className="flex items-center gap-2 px-3 py-1.5 w-full text-left hover:bg-gray-100"
        onClick={insertHeading}
      >
        <span className="material-icons text-gray-600">title</span>
        <div>
          <div className="text-sm font-medium">Heading</div>
          <div className="text-xs text-gray-500">Section heading (⌘+alt+1)</div>
        </div>
      </button>
      <button 
        className="flex items-center gap-2 px-3 py-1.5 w-full text-left hover:bg-gray-100"
        onClick={insertBulletList}
      >
        <span className="material-icons text-gray-600">format_list_bulleted</span>
        <div>
          <div className="text-sm font-medium">Bullet List</div>
          <div className="text-xs text-gray-500">Create a simple bullet list.</div>
        </div>
      </button>
      <div className="px-3 py-1 text-sm text-gray-500 font-medium">Media</div>
      <button 
        className="flex items-center gap-2 px-3 py-1.5 w-full text-left hover:bg-gray-100"
        onClick={insertImage}
      >
        <span className="material-icons text-gray-600">image</span>
        <div>
          <div className="text-sm font-medium">Image</div>
          <div className="text-xs text-gray-500">Upload or embed with a link.</div>
        </div>
      </button>
    </div>
  );
};

export default SlashCommandMenu;
