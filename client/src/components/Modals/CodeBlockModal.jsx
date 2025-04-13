import { useState } from 'react';
import { useEditor } from '../../hooks/useEditor';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
];

const CodeBlockModal = () => {
  const { editor, isCodeBlockModalOpen, closeCodeBlockModal } = useEditor();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  
  if (!isCodeBlockModalOpen) {
    return null;
  }
  
  const handleClose = () => {
    closeCodeBlockModal();
    // Reset form state
    setLanguage('javascript');
    setCode('');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!editor) return;
    
    // Insert code block
    editor
      .chain()
      .focus()
      .setCodeBlock({ language })
      .insertContent(code)
      .run();
    
    handleClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Insert Code Block</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Language selection */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Code input */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Code
              </label>
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={10}
                placeholder="Enter your code here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
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
              Insert Code Block
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CodeBlockModal;