import { useState } from 'react';
import { useEditor } from '../../hooks/useEditor';

const TableSettingsModal = () => {
  const { editor, isTableSettingsOpen, closeTableSettings } = useEditor();
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);
  
  if (!isTableSettingsOpen) {
    return null;
  }
  
  const handleClose = () => {
    closeTableSettings();
    // Reset form state
    setRows(3);
    setCols(3);
    setWithHeaderRow(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!editor) return;
    
    // Insert table
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();
    
    handleClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Insert Table</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Table dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="rows" className="block text-sm font-medium text-gray-700 mb-1">
                  Rows
                </label>
                <input
                  id="rows"
                  type="number"
                  min="1"
                  max="20"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="cols" className="block text-sm font-medium text-gray-700 mb-1">
                  Columns
                </label>
                <input
                  id="cols"
                  type="number"
                  min="1"
                  max="20"
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Header row option */}
            <div className="flex items-center">
              <input
                id="with-header"
                type="checkbox"
                checked={withHeaderRow}
                onChange={() => setWithHeaderRow(!withHeaderRow)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="with-header" className="ml-2 block text-sm font-medium text-gray-700">
                Include header row
              </label>
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Insert Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableSettingsModal;