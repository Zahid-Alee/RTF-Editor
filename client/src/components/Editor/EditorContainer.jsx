import EditorToolbar from './EditorToolbar';
import EditorContent from './EditorContent';
import EditorStatusBar from './EditorStatusBar';
import FloatingMenu from './FloatingMenu';
import SlashCommandMenu from './SlashCommandMenu';
import { useEditor } from '../../hooks/useEditor';

const EditorContainer = () => {
  const { editor } = useEditor();
  
  if (!editor) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <EditorToolbar />
      
      {editor && (
        <>
          <FloatingMenu editor={editor} />
          <SlashCommandMenu editor={editor} />
          <EditorContent editor={editor} />
        </>
      )}
      
      <EditorStatusBar />
    </div>
  );
};

export default EditorContainer;
