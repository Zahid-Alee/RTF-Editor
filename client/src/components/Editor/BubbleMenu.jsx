import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react';
import { useEditor } from '../../hooks/useEditor';
import ColorPicker from '../ColorPicker';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Link, 
  Highlighter, 
  Paintbrush, 
  Code, 
  Quote
} from 'lucide-react';

const BubbleMenu = () => {
  const { editor, openLinkModal } = useEditor();
  
  if (!editor) {
    return null;
  }
  
  // Text formatting
  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  
  // Text colors
  const setTextColor = (color) => {
    editor.chain().focus().setColor(color).run();
  };
  
  // Highlight
  const setHighlight = (color) => {
    editor.chain().focus().toggleHighlight({ color }).run();
  };
  
  // Link
  const setLink = () => {
    openLinkModal();
  };
  
  // Button styles
  const buttonClass = (isActive) => `
    flex items-center justify-center p-1.5 rounded-md text-sm
    ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
  `;
  
  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{ 
        duration: 150,
        hideOnClick: false,
        placement: 'top',
      }}
      className="bg-white rounded-md shadow-md border border-gray-200 flex items-center p-1 gap-0.5"
    >
      <button 
        onClick={toggleBold}
        className={buttonClass(editor.isActive('bold'))}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>
      
      <button 
        onClick={toggleItalic}
        className={buttonClass(editor.isActive('italic'))}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>
      
      <button 
        onClick={toggleUnderline}
        className={buttonClass(editor.isActive('underline'))}
        title="Underline (Ctrl+U)"
      >
        <Underline className="w-4 h-4" />
      </button>
      
      <button 
        onClick={toggleStrike}
        className={buttonClass(editor.isActive('strike'))}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      
      <div className="h-4 w-px bg-gray-200 mx-1"></div>
      
      <ColorPicker
        selectedColor={editor.getAttributes('textStyle').color || '#000000'}
        onColorSelect={setTextColor}
        title="Text Color"
      />
      
      <ColorPicker
        selectedColor={editor.getAttributes('highlight').color || '#FFFF00'}
        onColorSelect={setHighlight}
        title="Highlight Color"
      />
      
      <div className="h-4 w-px bg-gray-200 mx-1"></div>
      
      <button 
        onClick={toggleCode}
        className={buttonClass(editor.isActive('code'))}
        title="Inline Code"
      >
        <Code className="w-4 h-4" />
      </button>
      
      <button 
        onClick={toggleBlockquote}
        className={buttonClass(editor.isActive('blockquote'))}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>
      
      <button 
        onClick={setLink}
        className={buttonClass(editor.isActive('link'))}
        title="Add Link (Ctrl+K)"
      >
        <Link className="w-4 h-4" />
      </button>
    </TiptapBubbleMenu>
  );
};

export default BubbleMenu;