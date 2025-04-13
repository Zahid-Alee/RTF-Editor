import { useState } from 'react';
import { useEditor } from '../../hooks/useEditor';

const ImageDialog = () => {
  const { editor, isImageDialogOpen, closeImageDialog } = useEditor();
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [fileUpload, setFileUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!isImageDialogOpen) {
    return null;
  }
  
  const handleClose = () => {
    closeImageDialog();
    // Reset form state
    setImageUrl('');
    setAltText('');
    setWidth('');
    setHeight('');
    setFileUpload(null);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!editor) return;
    
    if (fileUpload) {
      // Handle file upload
      setIsLoading(true);
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        
        const attrs = {
          src: result,
          alt: altText || 'Image',
        };
        
        if (width) attrs.width = width;
        if (height) attrs.height = height;
        
        editor.chain().focus().setImage(attrs).run();
        
        setIsLoading(false);
        handleClose();
      };
      
      reader.readAsDataURL(fileUpload);
    } else if (imageUrl) {
      // Handle URL input
      const attrs = {
        src: imageUrl,
        alt: altText || 'Image',
      };
      
      if (width) attrs.width = width;
      if (height) attrs.height = height;
      
      editor.chain().focus().setImage(attrs).run();
      handleClose();
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUpload(file);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Insert Image</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Image URL input */}
            <div>
              <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                id="image-url"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!!fileUpload}
              />
            </div>
            
            {/* File upload */}
            <div>
              <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!!imageUrl}
              />
            </div>
            
            {/* Alt text */}
            <div>
              <label htmlFor="alt-text" className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text
              </label>
              <input
                id="alt-text"
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Image description for accessibility"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                  Width (px)
                </label>
                <input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  Height (px)
                </label>
                <input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g., 300"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={(!imageUrl && !fileUpload) || isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                (!imageUrl && !fileUpload) || isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Inserting...' : 'Insert Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageDialog;