import { useEffect } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { EditorContent as TiptapEditorContent } from '@tiptap/react';
import BubbleMenu from './BubbleMenu';

const EditorContent = () => {
  const { editor, openImageProperties } = useEditor();
  
  // Set up image click handler
  useEffect(() => {
    if (!editor) return;
    
    // Function to handle image clicks
    const handleImageClick = (event) => {
      // Check if the clicked element is an image
      if (event.target.tagName === 'IMG') {
        // Get the image's attributes
        const imageData = {
          src: event.target.getAttribute('src'),
          alt: event.target.getAttribute('alt') || '',
          title: event.target.getAttribute('title') || '',
          width: event.target.getAttribute('width') || '',
          height: event.target.getAttribute('height') || '',
          // Try to determine alignment from style
          alignment: event.target.style.float === 'right' ? 'right' : 
                    (event.target.style.display === 'block' && 
                     event.target.style.marginLeft === 'auto' && 
                     event.target.style.marginRight === 'auto') ? 'center' : 'left'
        };
        
        // Open the image properties modal with this data
        openImageProperties(imageData);
      }
    };
    
    // Add click event listener to the editor
    const editorElement = editor.view.dom;
    editorElement.addEventListener('click', handleImageClick);
    
    // Clean up
    return () => {
      editorElement.removeEventListener('click', handleImageClick);
    };
  }, [editor, openImageProperties]);
  
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