import { useEditor } from '../../hooks/useEditor';

// Keyboard shortcuts list
const SHORTCUTS = [
  { description: 'Bold', shortcut: 'Ctrl+B' },
  { description: 'Italic', shortcut: 'Ctrl+I' },
  { description: 'Underline', shortcut: 'Ctrl+U' },
  { description: 'Link', shortcut: 'Ctrl+K' },
  { description: 'Save', shortcut: 'Ctrl+S' },
  { description: 'Undo', shortcut: 'Ctrl+Z' },
  { description: 'Redo', shortcut: 'Ctrl+Shift+Z' },
  { description: 'Heading 1', shortcut: 'Ctrl+Alt+1' },
  { description: 'Heading 2', shortcut: 'Ctrl+Alt+2' },
  { description: 'Heading 3', shortcut: 'Ctrl+Alt+3' },
  { description: 'Code Block', shortcut: 'Ctrl+Alt+C' },
  { description: 'Bullet List', shortcut: 'Ctrl+Shift+8' },
  { description: 'Numbered List', shortcut: 'Ctrl+Shift+7' },
  { description: 'Task List', shortcut: 'Ctrl+Shift+9' },
  { description: 'Blockquote', shortcut: 'Ctrl+Shift+B' },
];

const KeyboardShortcutsModal = () => {
  const { isKeyboardShortcutsOpen, closeKeyboardShortcuts } = useEditor();
  
  if (!isKeyboardShortcutsOpen) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Keyboard Shortcuts</h2>
          <button onClick={closeKeyboardShortcuts} className="text-gray-400 hover:text-gray-600">
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {SHORTCUTS.map((item, index) => (
              <div key={index} className="flex justify-between p-2 border-b border-gray-100">
                <span className="text-gray-800">{item.description}</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-sm">
                  {item.shortcut}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>
              <strong>Note:</strong> Keyboard shortcuts may vary depending on the operating system. 
              On macOS, use ⌘ (Command) instead of Ctrl.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={closeKeyboardShortcuts}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;