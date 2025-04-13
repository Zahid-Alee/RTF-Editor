import { useEditor } from '../../hooks/useEditor';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const EmojiPicker = () => {
  const { editor, isEmojiPickerOpen, closeEmojiPicker } = useEditor();
  
  if (!isEmojiPickerOpen) {
    return null;
  }
  
  const handleEmojiSelect = (emoji) => {
    if (editor) {
      editor.chain().focus().insertContent(emoji.native).run();
      closeEmojiPicker();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Insert Emoji</h2>
          <button onClick={closeEmojiPicker} className="text-gray-400 hover:text-gray-600">
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="p-4">
          <Picker 
            data={data} 
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            previewPosition="none"
          />
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;