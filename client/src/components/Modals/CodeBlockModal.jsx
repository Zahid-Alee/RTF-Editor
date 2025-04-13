import { useState } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { X, Code } from 'lucide-react';

const LANGUAGES = [
  // Web development 
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'React JSX' },
  { value: 'tsx', label: 'React TSX' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'less', label: 'Less' },
  
  // Backend languages
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  
  // Data & Config
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'xml', label: 'XML' },
  
  // Shell scripting
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'powershell', label: 'PowerShell' },
  
  // Other
  { value: 'markdown', label: 'Markdown' },
  { value: 'diff', label: 'Diff' },
  { value: 'plaintext', label: 'Plain Text' },
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
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Insert Code Block</h2>
          </div>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
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
                <optgroup label="Web Development">
                  {LANGUAGES.slice(0, 8).map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Backend Languages">
                  {LANGUAGES.slice(8, 18).map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Data & Config">
                  {LANGUAGES.slice(18, 22).map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Shell Scripting">
                  {LANGUAGES.slice(22, 25).map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Other">
                  {LANGUAGES.slice(25).map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
            
            {/* Code input */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Code
              </label>
              <div className="relative">
                <textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={12}
                  placeholder="Enter your code here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-gray-50"
                  spellCheck="false"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                />
                <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                  {language}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                The code will be syntax highlighted based on the selected language.
              </p>
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center gap-1"
            >
              <Code className="h-4 w-4" />
              Insert Code Block
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CodeBlockModal;