import { useEditor } from '../../hooks/useEditor';
import { EditorContent as TiptapEditorContent } from '@tiptap/react';
import BubbleMenu from './BubbleMenu';

const EditorContent = () => {
  const { editor } = useEditor();
  
  if (!editor) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {/* Bubble menu appears when text is selected */}
      <BubbleMenu />
      
      <TiptapEditorContent 
        editor={editor} 
        className="prose prose-slate max-w-none focus:outline-none" 
      />
    </div>
  );
};

export default EditorContent;