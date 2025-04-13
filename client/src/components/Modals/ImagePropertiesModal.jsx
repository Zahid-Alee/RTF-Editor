import { useState, useEffect } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { X, Move, AlignCenter, AlignLeft, AlignRight } from 'lucide-react';

const ImagePropertiesModal = () => {
  const { editor, isImagePropertiesOpen, closeImageProperties, selectedImageData } = useEditor();
  
  const [imageData, setImageData] = useState({
    src: '',
    alt: '',
    title: '',
    width: '',
    height: '',
    alignment: 'left'
  });
  
  useEffect(() => {
    if (selectedImageData) {
      setImageData({
        src: selectedImageData.src || '',
        alt: selectedImageData.alt || '',
        title: selectedImageData.title || '',
        width: selectedImageData.width || '',
        height: selectedImageData.height || '',
        alignment: selectedImageData.alignment || 'left'
      });
    }
  }, [selectedImageData]);
  
  if (!isImagePropertiesOpen) {
    return null;
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setImageData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!editor) return;
    
    // Update the image
    editor.view.state.doc.nodesBetween(0, editor.view.state.doc.content.size, (node, pos) => {
      if (node.type.name === 'image' && node.attrs.src === selectedImageData?.src) {
        const attributes = {
          src: imageData.src,
          alt: imageData.alt,
          title: imageData.title
        };
        
        if (imageData.width) {
          attributes.width = imageData.width;
        }
        
        if (imageData.height) {
          attributes.height = imageData.height;
        }
        
        // Add style for alignment
        let style = '';
        if (imageData.alignment === 'center') {
          style = 'display: block; margin-left: auto; margin-right: auto;';
        } else if (imageData.alignment === 'right') {
          style = 'float: right; margin-left: 10px;';
        } else {
          style = 'float: left; margin-right: 10px;';
        }
        attributes.style = style;
        
        editor.chain().focus().setNodeSelection(pos).updateAttributes('image', attributes).run();
        
        return false; // Stop iterating
      }
      return true;
    });
    
    closeImageProperties();
  };
  
  const handleCancel = () => {
    closeImageProperties();
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Image Properties</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="src" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              id="src"
              name="src"
              value={imageData.src}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              id="alt"
              name="alt"
              value={imageData.alt}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={imageData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                Width
              </label>
              <input
                type="text"
                id="width"
                name="width"
                value={imageData.width}
                onChange={handleInputChange}
                placeholder="px, % or auto"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <input
                type="text"
                id="height"
                name="height"
                value={imageData.height}
                onChange={handleInputChange}
                placeholder="px, % or auto"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alignment
            </label>
            <div className="flex justify-start space-x-2">
              <button
                type="button"
                className={`p-2 rounded ${
                  imageData.alignment === 'left' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setImageData(prev => ({ ...prev, alignment: 'left' }))}
                title="Align Left"
              >
                <AlignLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                className={`p-2 rounded ${
                  imageData.alignment === 'center' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setImageData(prev => ({ ...prev, alignment: 'center' }))}
                title="Align Center"
              >
                <AlignCenter className="w-5 h-5" />
              </button>
              <button
                type="button"
                className={`p-2 rounded ${
                  imageData.alignment === 'right' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setImageData(prev => ({ ...prev, alignment: 'right' }))}
                title="Align Right"
              >
                <AlignRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImagePropertiesModal;