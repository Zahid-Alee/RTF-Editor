import { useEditor } from '../../hooks/useEditor';
import ExportDropdown from '../ExportDropdown';

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
  
  // Code block 
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  
  // Links
  const setLink = () => {
    // Open link modal
    openLinkModal();
  };
  
  // Undo/Redo
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();
  
  // Button classes based on active state
  const buttonClass = (isActive) => 
    `p-2 rounded-md text-sm font-medium ${
      isActive 
        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
    }`;
  
  return (
    <div className="border-b border-gray-200 bg-white p-2 flex flex-wrap gap-1 items-center overflow-x-auto">
      {/* Text Formatting */}
      <div className="flex border-r border-gray-200 pr-2 mr-2">
        <button 
          onClick={toggleBold} 
          className={buttonClass(editor.isActive('bold'))}
          title="Bold (Ctrl+B)"
        >
          <span className="material-icons text-lg">format_bold</span>
        </button>
        <button 
          onClick={toggleItalic} 
          className={buttonClass(editor.isActive('italic'))}
          title="Italic (Ctrl+I)"
        >
          <span className="material-icons text-lg">format_italic</span>
        </button>
        <button 
          onClick={toggleUnderline} 
          className={buttonClass(editor.isActive('underline'))}
          title="Underline (Ctrl+U)"
        >
          <span className="material-icons text-lg">format_underlined</span>
        </button>
        <button 
          onClick={toggleStrike} 
          className={buttonClass(editor.isActive('strike'))}
          title="Strikethrough"
        >
          <span className="material-icons text-lg">strikethrough_s</span>
        </button>
      </div>
      
      {/* Headings */}
      <div className="flex border-r border-gray-200 pr-2 mr-2">
        <button 
          onClick={() => toggleHeading(1)} 
          className={buttonClass(isHeadingActive(1))}
          title="Heading 1"
        >
          <span className="material-icons text-lg">looks_one</span>
        </button>
        <button 
          onClick={() => toggleHeading(2)} 
          className={buttonClass(isHeadingActive(2))}
          title="Heading 2"
        >
          <span className="material-icons text-lg">looks_two</span>
        </button>
        <button 
          onClick={() => toggleHeading(3)} 
          className={buttonClass(isHeadingActive(3))}
          title="Heading 3"
        >
          <span className="material-icons text-lg">looks_3</span>
        </button>
      </div>
      
      {/* Alignment */}
      <div className="flex border-r border-gray-200 pr-2 mr-2">
        <button 
          onClick={() => setTextAlign('left')} 
          className={buttonClass(isTextAlignActive('left'))}
          title="Align left"
        >
          <span className="material-icons text-lg">format_align_left</span>
        </button>
        <button 
          onClick={() => setTextAlign('center')} 
          className={buttonClass(isTextAlignActive('center'))}
          title="Align center"
        >
          <span className="material-icons text-lg">format_align_center</span>
        </button>
        <button 
          onClick={() => setTextAlign('right')} 
          className={buttonClass(isTextAlignActive('right'))}
          title="Align right"
        >
          <span className="material-icons text-lg">format_align_right</span>
        </button>
        <button 
          onClick={() => setTextAlign('justify')} 
          className={buttonClass(isTextAlignActive('justify'))}
          title="Justify"
        >
          <span className="material-icons text-lg">format_align_justify</span>
        </button>
      </div>
      
      {/* Lists */}
      <div className="flex border-r border-gray-200 pr-2 mr-2">
        <button 
          onClick={toggleBulletList} 
          className={buttonClass(editor.isActive('bulletList'))}
          title="Bullet list"
        >
          <span className="material-icons text-lg">format_list_bulleted</span>
        </button>
        <button 
          onClick={toggleOrderedList} 
          className={buttonClass(editor.isActive('orderedList'))}
          title="Numbered list"
        >
          <span className="material-icons text-lg">format_list_numbered</span>
        </button>
        <button 
          onClick={toggleTaskList} 
          className={buttonClass(editor.isActive('taskList'))}
          title="Task list"
        >
          <span className="material-icons text-lg">checklist</span>
        </button>
      </div>
      
      {/* Text Block Styles */}
      <div className="flex border-r border-gray-200 pr-2 mr-2">
        <button 
          onClick={toggleBlockquote} 
          className={buttonClass(editor.isActive('blockquote'))}
          title="Blockquote"
        >
          <span className="material-icons text-lg">format_quote</span>
        </button>
        <button 
          onClick={openCodeBlockModal} 
          className={buttonClass(editor.isActive('codeBlock'))}
          title="Code Block"
        >
          <span className="material-icons text-lg">code</span>
        </button>
      </div>
      
      {/* Media */}
      <div className="flex border-r border-gray-200 pr-2 mr-2">
        <button 
          onClick={openImageDialog} 
          className={buttonClass(false)}
          title="Insert image"
        >
          <span className="material-icons text-lg">image</span>
        </button>
        <button 
          onClick={setLink} 
          className={buttonClass(editor.isActive('link'))}
          title="Insert link (Ctrl+K)"
        >
          <span className="material-icons text-lg">link</span>
        </button>
        <button 
          onClick={openTableSettings} 
          className={buttonClass(editor.isActive('table'))}
          title="Insert table"
        >
          <span className="material-icons text-lg">table_chart</span>
        </button>
        <button 
          onClick={openEmojiPicker} 
          className={buttonClass(false)}
          title="Insert emoji"
        >
          <span className="material-icons text-lg">sentiment_satisfied_alt</span>
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
          <span className="material-icons text-lg">undo</span>
        </button>
        <button 
          onClick={redo} 
          className={buttonClass(false)}
          title="Redo (Ctrl+Shift+Z)"
          disabled={!editor.can().redo()}
        >
          <span className="material-icons text-lg">redo</span>
        </button>
        <ExportDropdown />
      </div>
    </div>
  );
};

export default EditorToolbar;