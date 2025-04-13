import { useState, useRef } from 'react';
import { useEditor } from '../hooks/useEditor';

const ExportDropdown = () => {
  const { editor } = useEditor();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  if (!editor) {
    return null;
  }
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Export as HTML
  const exportHTML = () => {
    const html = editor.getHTML();
    
    // Create a temporary link to download the file
    const element = document.createElement('a');
    const file = new Blob([html], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'document.html';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setIsOpen(false);
  };
  
  // Export as plain text
  const exportText = () => {
    const text = editor.getText();
    
    // Create a temporary link to download the file
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'document.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setIsOpen(false);
  };
  
  // Export as JSON
  const exportJSON = () => {
    const json = JSON.stringify(editor.getJSON(), null, 2);
    
    // Create a temporary link to download the file
    const element = document.createElement('a');
    const file = new Blob([json], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'document.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setIsOpen(false);
  };
  
  // Export as markdown
  const exportMarkdown = () => {
    try {
      // Get the editor content as JSON
      const json = editor.getJSON();
      
      // Simple conversion to markdown
      let markdownContent = "";
      
      // Process nodes recursively to convert to markdown
      const processNode = (node) => {
        if (node.type === 'doc') {
          return node.content?.map(processNode).join('\n\n') || '';
        }
        
        if (node.type === 'paragraph') {
          return node.content?.map(processNode).join('') || '';
        }
        
        if (node.type === 'text') {
          let text = node.text || '';
          
          // Apply marks
          if (node.marks) {
            for (const mark of node.marks) {
              if (mark.type === 'bold') {
                text = `**${text}**`;
              } else if (mark.type === 'italic') {
                text = `*${text}*`;
              } else if (mark.type === 'underline') {
                text = `__${text}__`;
              } else if (mark.type === 'strike') {
                text = `~~${text}~~`;
              } else if (mark.type === 'link') {
                text = `[${text}](${mark.attrs.href})`;
              }
            }
          }
          
          return text;
        }
        
        if (node.type === 'heading') {
          const level = node.attrs.level;
          const prefix = '#'.repeat(level) + ' ';
          return prefix + (node.content?.map(processNode).join('') || '');
        }
        
        if (node.type === 'bulletList') {
          return node.content?.map(item => processNode(item)).join('\n') || '';
        }
        
        if (node.type === 'orderedList') {
          return node.content?.map((item, i) => {
            const content = processNode(item);
            return `${i + 1}. ${content.substring(2)}`; // Remove "* " prefix
          }).join('\n') || '';
        }
        
        if (node.type === 'listItem') {
          return '* ' + (node.content?.map(processNode).join('') || '');
        }
        
        if (node.type === 'taskList' || node.type === 'taskItem') {
          return node.content?.map(processNode).join('\n') || '';
        }
        
        if (node.type === 'blockquote') {
          return '> ' + (node.content?.map(processNode).join('') || '');
        }
        
        if (node.type === 'codeBlock') {
          const language = node.attrs.language || '';
          const code = node.content?.map(n => n.text).join('\\n') || '';
          return '```' + language + '\\n' + code + '\\n```';
        }
        
        // Default for unsupported node types
        return node.content ? node.content.map(processNode).join('') : '';
      };
      
      markdownContent = processNode(json);
      
      // Create a temporary link to download the file
      const element = document.createElement('a');
      const file = new Blob([markdownContent], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = 'document.md';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Failed to export as markdown:', error);
    }
    
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        title="Export"
      >
        <span className="material-icons text-lg">download</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={exportHTML}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Export as HTML
            </button>
            <button
              onClick={exportText}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Export as Text
            </button>
            <button
              onClick={exportMarkdown}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Export as Markdown
            </button>
            <button
              onClick={exportJSON}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Export as JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;