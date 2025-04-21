import { useState } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { X, Upload, Link } from 'lucide-react';

const ImageDialog = () => {
  const { editor, isImageDialogOpen, closeImageDialog } = useEditor();
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [fileUpload, setFileUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'upload'
  
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
    setActiveTab('url');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!editor) return;
    
    if (activeTab === 'upload' && fileUpload) {
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
        
        // Insert the image at the current selection
        editor.chain().focus().setImage(attrs).run();
        
        setIsLoading(false);
        handleClose();
      };
      
      reader.readAsDataURL(fileUpload);
    } else if (activeTab === 'url' && imageUrl) {
      // Handle URL input
      const attrs = {
        src: imageUrl,
        alt: altText || 'Image',
      };
      
      if (width) attrs.width = width;
      if (height) attrs.height = height;
      
      // Insert the image at the current selection
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Insert Image</h2>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'url' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Link className="w-4 h-4 mr-2" />
            Image URL
          </button>
          
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'upload' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Image URL input */}
            {activeTab === 'url' && (
              <div className="transition-all">
                <label htmlFor="image-url" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  id="image-url"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
            )}
            
            {/* File upload */}
            {activeTab === 'upload' && (
              <div className="transition-all">
                <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image
                </label>
                <div className="w-full px-3 relative py-8 border border-dashed border-gray-300 rounded-md text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {fileUpload ? fileUpload.name : 'Click or drag image to upload'}
                  </p>
                </div>
              </div>
            )}
            
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={(activeTab === 'url' && !imageUrl) || (activeTab === 'upload' && !fileUpload) || isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors ${
                (activeTab === 'url' && !imageUrl) || (activeTab === 'upload' && !fileUpload) || isLoading 
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