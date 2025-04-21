import { useState, useEffect } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { X, AlignCenter, AlignLeft, AlignRight, Link, Type, Maximize } from 'lucide-react';

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
      // Extract alignment from style if it exists
      let alignment = 'left';
      if (selectedImageData.style) {
        if (selectedImageData.style.includes('margin-left: auto; margin-right: auto')) {
          alignment = 'center';
        } else if (selectedImageData.style.includes('float: right')) {
          alignment = 'right';
        }
      }
      
      setImageData({
        src: selectedImageData.src || '',
        alt: selectedImageData.alt || '',
        title: selectedImageData.title || '',
        width: selectedImageData.width || '',
        height: selectedImageData.height || '',
        alignment
      });
    }
  }, [selectedImageData]);
  
  if (!isImagePropertiesOpen || !editor) {
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
    
    try {
      // Create the attributes object for the image
      const attributes = {
        src: imageData.src,
        alt: imageData.alt,
        title: imageData.title
      };
      
      // Handle width and height
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
      
      // Use a simpler approach - if an image is selected, update its attributes
      if (editor.isActive('image')) {
        editor.chain().updateAttributes('image', attributes).run();
      }
    } catch (error) {
      console.error("Error updating image:", error);
    }
    
    closeImageProperties();
  };
  
  const handleCancel = () => {
    closeImageProperties();
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Image Properties</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="src" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Link className="w-4 h-4 mr-2 text-gray-500" />
                Image URL
              </label>
              <input
                type="text"
                id="src"
                name="src"
                value={imageData.src}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                required
              />
            </div>
            
            <div>
              <label htmlFor="alt" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Type className="w-4 h-4 mr-2 text-gray-500" />
                Alt Text
              </label>
              <input
                type="text"
                id="alt"
                name="alt"
                value={imageData.alt}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              <p className="mt-1 text-xs text-gray-500">Description for accessibility and SEO</p>
            </div>
            
            <div>
              <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Type className="w-4 h-4 mr-2 text-gray-500" />
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={imageData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              <p className="mt-1 text-xs text-gray-500">Displays as tooltip on hover</p>
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Maximize className="w-4 h-4 mr-2 text-gray-500" />
                Dimensions
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    id="width"
                    name="width"
                    value={imageData.width}
                    onChange={handleInputChange}
                    placeholder="Width (px, % or auto)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="height"
                    name="height"
                    value={imageData.height}
                    onChange={handleInputChange}
                    placeholder="Height (px, % or auto)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Alignment
              </label>
              <div className="flex justify-start space-x-2 bg-gray-50 p-2 rounded-md">
                <button
                  type="button"
                  className={`flex items-center justify-center p-2 rounded flex-1 transition-colors ${
                    imageData.alignment === 'left' 
                      ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                  onClick={() => setImageData(prev => ({ ...prev, alignment: 'left' }))}
                  title="Align Left"
                >
                  <AlignLeft className="w-5 h-5" />
                  <span className="ml-2 text-sm">Left</span>
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center p-2 rounded flex-1 transition-colors ${
                    imageData.alignment === 'center' 
                      ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                  onClick={() => setImageData(prev => ({ ...prev, alignment: 'center' }))}
                  title="Align Center"
                >
                  <AlignCenter className="w-5 h-5" />
                  <span className="ml-2 text-sm">Center</span>
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center p-2 rounded flex-1 transition-colors ${
                    imageData.alignment === 'right' 
                      ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                  onClick={() => setImageData(prev => ({ ...prev, alignment: 'right' }))}
                  title="Align Right"
                >
                  <AlignRight className="w-5 h-5" />
                  <span className="ml-2 text-sm">Right</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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