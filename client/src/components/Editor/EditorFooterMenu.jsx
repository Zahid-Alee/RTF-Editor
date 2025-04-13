import { useEditor } from '../../hooks/useEditor';

const EditorFooterMenu = () => {
  const { editor, saveContent, openKeyboardShortcuts } = useEditor();
  
  if (!editor) {
    return null;
  }
  
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={saveContent}
        className="py-1 px-2 inline-flex justify-center items-center gap-1 rounded-md border border-transparent font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all text-xs"
      >
        <span className="material-icons text-sm">save</span>
        Save
      </button>
      
      <button
        onClick={openKeyboardShortcuts}
        className="py-1 px-2 inline-flex justify-center items-center gap-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all text-xs"
      >
        <span className="material-icons text-sm">keyboard</span>
        Shortcuts
      </button>
    </div>
  );
};

export default EditorFooterMenu;