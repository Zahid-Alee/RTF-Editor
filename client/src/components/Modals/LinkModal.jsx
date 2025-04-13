import { useState, useEffect } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { isValidURL } from '../../lib/utils.jsx';

const LinkModal = () => {
  const { editor, isLinkModalOpen, closeLinkModal } = useEditor();
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [text, setText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);
  
  useEffect(() => {
    if (isLinkModalOpen && editor) {
      // Check if there's already a link at the current selection
      const linkNode = editor.getAttributes('link');
      
      if (linkNode.href) {
        setUrl(linkNode.href);
        setOpenInNewTab(linkNode.target === '_blank');
      }
      
      // Get selected text if any
      const selectedText = editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to,
        ' '
      );
      
      if (selectedText) {
        setText(selectedText);
      }
    }
  }, [isLinkModalOpen, editor]);
  
  if (!isLinkModalOpen) {
    return null;
  }
  
  const handleClose = () => {
    closeLinkModal();
    // Reset form state
    setUrl('');
    setText('');
    setOpenInNewTab(true);
    setUrlError('');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!editor) return;
    
    // Basic validation
    if (!url) {
      setUrlError('URL is required');
      return;
    }
    
    if (!isValidURL(url)) {
      setUrlError('Please enter a valid URL (including http:// or https://)');
      return;
    }
    
    // If there's no selected text but text is provided in the form
    if (text && editor.state.selection.empty) {
      // Insert the text and select it
      editor.chain().focus().insertContent(text).run();
      
      // Find the position of the inserted text
      const { from } = editor.state.selection;
      const to = from + text.length;
      
      // Select the inserted text
      editor.chain().focus().setTextSelection({ from, to }).run();
    }
    
    // Apply link to selection
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ 
        href: url, 
        target: openInNewTab ? '_blank' : null,
        rel: openInNewTab ? 'noopener noreferrer' : null 
      })
      .run();
    
    handleClose();
  };
  
  const handleRemoveLink = () => {
    if (!editor) return;
    
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    handleClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {editor && editor.isActive('link') ? 'Edit Link' : 'Insert Link'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* URL input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setUrlError(''); // Clear error on change
                }}
                placeholder="https://example.com"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  urlError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {urlError && <p className="mt-1 text-sm text-red-600">{urlError}</p>}
            </div>
            
            {/* Link text input (only show if no text is selected) */}
            {editor && editor.state.selection.empty && (
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                  Text to display
                </label>
                <input
                  id="text"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Link text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            {/* Open in new tab option */}
            <div className="flex items-center">
              <input
                id="new-tab"
                type="checkbox"
                checked={openInNewTab}
                onChange={() => setOpenInNewTab(!openInNewTab)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="new-tab" className="ml-2 block text-sm font-medium text-gray-700">
                Open in new tab
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            {editor && editor.isActive('link') && (
              <button
                type="button"
                onClick={handleRemoveLink}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Remove Link
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {editor && editor.isActive('link') ? 'Update Link' : 'Insert Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;