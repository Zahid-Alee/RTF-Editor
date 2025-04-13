import { useEditor } from '../../hooks/useEditor';
import ExportDropdown from '../ExportDropdown';
import ColorPicker from '../ColorPicker';
import FontSelector from '../FontSelector';
import SpacingControls from '../SpacingControls';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  Heading1, 
  Heading2, 
  Heading3,
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List, 
  ListOrdered, 
  CheckSquare,
  Quote, 
  Code,
  Image, 
  Link, 
  Table, 
  Smile,
  Undo, 
  Redo,
} from 'lucide-react';

const EditorToolbar = () => {
  const { 
    editor, 
    openImageDialog, 
    openEmojiPicker, 
    openTableSettings, 
    openCodeBlockModal,
    openLinkModal
  } = useEditor();
  
  if (!editor) {
    return (
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-2">
        <div className="flex space-x-1 overflow-x-auto">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // Toggle text formatting
  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  
  // Text alignment
  const setTextAlign = (align) => editor.chain().focus().setTextAlign(align).run();
  const isTextAlignActive = (align) => editor.isActive({ textAlign: align });
  
  // Headings
  const toggleHeading = (level) => editor.chain().focus().toggleHeading({ level }).run();
  const isHeadingActive = (level) => editor.isActive('heading', { level });
  
  // Lists
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleTaskList = () => editor.chain().focus().toggleTaskList().run();
  
  // Blockquote
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();
  
  // Links
  const setLink = () => {
    // Open link modal
    openLinkModal();
  };
  
  // Colors
  const setTextColor = (color) => {
    editor.chain().focus().setColor(color).run();
  };
  
  const setHighlight = (color) => {
    editor.chain().focus().toggleHighlight({ color }).run();
  };
  
  // Font family
  const setFontFamily = (fontFamily) => {
    editor.chain().focus().setFontFamily(fontFamily).run();
  };
  
  // Spacing controls
  const setLineHeight = (height) => {
    editor.chain().focus().setLineHeight(height).run();
  };
  
  const setLetterSpacing = (spacing) => {
    editor.chain().focus().setLetterSpacing(spacing + 'em').run();
  };
  
  const setWordSpacing = (spacing) => {
    editor.chain().focus().setWordSpacing(spacing + 'em').run();
  };
  
  // Undo/Redo
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();
  
  // Button classes based on active state
  const buttonClass = (isActive) => 
    `p-2 rounded-md text-sm font-medium flex items-center justify-center ${
      isActive 
        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
    }`;
  
  return (
    <div className="border-b border-gray-200 bg-white p-2 flex flex-wrap gap-1 items-center overflow-x-auto">
      {/* Font selector */}
      <div className="mr-2">
        <FontSelector 
          selectedFont={editor.getAttributes('textStyle').fontFamily} 
          onFontSelect={setFontFamily} 
        />
      </div>
      
      {/* Text Formatting */}
      <div className="flex border-r border-gray-200 pr-2 mr-2">
        <button 
          onClick={toggleBold} 
          className={buttonClass(editor.isActive('bold'))}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button 
          onClick={toggleItalic} 
          className={buttonClass(editor.isActive('italic'))}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button 
          onClick={toggleUnderline} 
          className={buttonClass(editor.isActive('underline'))}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </button>
        <button 
          onClick={toggleStrike} 
          className={buttonClass(editor.isActive('strike'))}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
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
      </div>
      
      {/* Headings */}
      <div className="flex border-r border-gray-200 pr-2 mr-2">
        <button 
          onClick={() => toggleHeading(1)} 
          className={buttonClass(isHeadingActive(1))}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button 
          onClick={() => toggleHeading(2)} 
          className={buttonClass(isHeadingActive(2))}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button 
          onClick={() => toggleHeading(3)} 
          className={buttonClass(isHeadingActive(3))}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>
      </div>
      
      {/* Alignment */}
      <div className="flex border-r border-gray-200 pr-2 mr-2">
        <button 
          onClick={() => setTextAlign('left')} 
          className={buttonClass(isTextAlignActive('left'))}
          title="Align left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button 
          onClick={() => setTextAlign('center')} 
          className={buttonClass(isTextAlignActive('center'))}
          title="Align center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button 
          onClick={() => setTextAlign('right')} 
          className={buttonClass(isTextAlignActive('right'))}
          title="Align right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button 
          onClick={() => setTextAlign('justify')} 
          className={buttonClass(isTextAlignActive('justify'))}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </button>
      </div>
      
      {/* Lists */}
      <div className="flex border-r border-gray-200 pr-2 mr-2">
        <button 
          onClick={toggleBulletList} 
          className={buttonClass(editor.isActive('bulletList'))}
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </button>
        <button 
          onClick={toggleOrderedList} 
          className={buttonClass(editor.isActive('orderedList'))}
          title="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button 
          onClick={toggleTaskList} 
          className={buttonClass(editor.isActive('taskList'))}
          title="Task list"
        >
          <CheckSquare className="h-4 w-4" />
        </button>
      </div>
      
      {/* Spacing controls */}
      <div className="flex border-r border-gray-200 pr-2 mr-2">
        <SpacingControls
          lineHeight={editor.getAttributes('paragraph').lineHeight || 1.5}
          letterSpacing={parseFloat(editor.getAttributes('textStyle').letterSpacing) || 0}
          wordSpacing={parseFloat(editor.getAttributes('paragraph').wordSpacing) || 0}
          onLineHeightChange={setLineHeight}
          onLetterSpacingChange={setLetterSpacing}
          onWordSpacingChange={setWordSpacing}
        />
      </div>
      
      {/* Text Block Styles */}
      <div className="flex border-r border-gray-200 pr-2 mr-2">
        <button 
          onClick={toggleBlockquote} 
          className={buttonClass(editor.isActive('blockquote'))}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button 
          onClick={openCodeBlockModal} 
          className={buttonClass(editor.isActive('codeBlock'))}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </button>
      </div>
      
      {/* Media */}
      <div className="flex border-r border-gray-200 pr-2 mr-2">
        <button 
          onClick={openImageDialog} 
          className={buttonClass(false)}
          title="Insert image"
        >
          <Image className="h-4 w-4" />
        </button>
        <button 
          onClick={setLink} 
          className={buttonClass(editor.isActive('link'))}
          title="Insert link (Ctrl+K)"
        >
          <Link className="h-4 w-4" />
        </button>
        <button 
          onClick={openTableSettings} 
          className={buttonClass(editor.isActive('table'))}
          title="Insert table"
        >
          <Table className="h-4 w-4" />
        </button>
        <button 
          onClick={openEmojiPicker} 
          className={buttonClass(false)}
          title="Insert emoji"
        >
          <Smile className="h-4 w-4" />
        </button>
      </div>
      
      {/* Undo/Redo */}
      <div className="flex ml-auto">
        <button 
          onClick={undo} 
          className={buttonClass(false)}
          title="Undo (Ctrl+Z)"
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </button>
        <button 
          onClick={redo} 
          className={buttonClass(false)}
          title="Redo (Ctrl+Shift+Z)"
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </button>
        <ExportDropdown />
      </div>
    </div>
  );
};

export default EditorToolbar;