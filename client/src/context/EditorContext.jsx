import { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { useEditor as useTiptapEditor } from '@tiptap/react';
import { extensions } from '../lib/tiptapExtensions';
import { debounce } from '../lib/utils.jsx';

// Create context
export const EditorContext = createContext();

// Storage key for local storage
const STORAGE_KEY = 'tiptap-editor-content';

export const EditorProvider = ({ children }) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [isCodeBlockModalOpen, setIsCodeBlockModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
  const [isImagePropertiesOpen, setIsImagePropertiesOpen] = useState(false);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Get default content from local storage
  const getInitialContent = () => {
    if (typeof window === 'undefined') {
      return '';
    }
    
    const savedContent = localStorage.getItem(STORAGE_KEY);
    
    // If no saved content, return default content
    if (!savedContent) {
      return {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Welcome to the Rich Text Editor' }]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'This is a fully featured editor built with ' },
              { type: 'text', marks: [{ type: 'bold' }], text: 'TipTap' },
              { type: 'text', text: ' and ' },
              { type: 'text', marks: [{ type: 'bold' }], text: 'React' },
              { type: 'text', text: '. Try out the various formatting options available in the toolbar above.' }
            ]
          },
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: 'Features Include:' }]
          },
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Text formatting (bold, italic, underline)' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Lists (bulleted, numbered, tasks)' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Tables and media embedding' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Code blocks with syntax highlighting' }] }]
              },
              {
                type: 'listItem',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'And much more!' }] }]
              }
            ]
          },
          {
            type: 'blockquote',
            content: [
              { 
                type: 'paragraph', 
                content: [{ type: 'text', text: 'Pro tip: You can also use the slash command by typing "/" to access quick formatting options.' }] 
              }
            ]
          }
        ]
      };
    }
    
    try {
      return JSON.parse(savedContent);
    } catch (e) {
      console.error('Failed to parse saved content:', e);
      return '';
    }
  };
  
  // Create editor instance
  const editor = useTiptapEditor({
    extensions,
    content: getInitialContent(),
    autofocus: 'end',
    onUpdate: ({ editor }) => {
      // Debounce to save content only when user stops typing
      debouncedSave(editor);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  });
  
  // Create a debounced version of saveContent
  const debouncedSave = useRef(
    debounce((editor) => {
      if (editor) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(editor.getJSON()));
        setLastSaved(new Date());
      }
    }, 1000)
  ).current;
  
  // Manual save function
  const saveContent = useCallback(() => {
    if (editor) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editor.getJSON()));
      setLastSaved(new Date());
    }
  }, [editor]);
  
  // Listen for Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveContent();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveContent]);
  
  // Dialog handlers
  const openImageDialog = useCallback(() => {
    setIsImageDialogOpen(true);
  }, []);
  
  const closeImageDialog = useCallback(() => {
    setIsImageDialogOpen(false);
  }, []);
  
  const openEmojiPicker = useCallback(() => {
    setIsEmojiPickerOpen(true);
  }, []);
  
  const closeEmojiPicker = useCallback(() => {
    setIsEmojiPickerOpen(false);
  }, []);
  
  const openTableSettings = useCallback(() => {
    setIsTableSettingsOpen(true);
  }, []);
  
  const closeTableSettings = useCallback(() => {
    setIsTableSettingsOpen(false);
  }, []);
  
  const openCodeBlockModal = useCallback(() => {
    setIsCodeBlockModalOpen(true);
  }, []);
  
  const closeCodeBlockModal = useCallback(() => {
    setIsCodeBlockModalOpen(false);
  }, []);
  
  const openLinkModal = useCallback(() => {
    setIsLinkModalOpen(true);
  }, []);
  
  const closeLinkModal = useCallback(() => {
    setIsLinkModalOpen(false);
  }, []);
  
  const openKeyboardShortcuts = useCallback(() => {
    setIsKeyboardShortcutsOpen(true);
  }, []);
  
  const closeKeyboardShortcuts = useCallback(() => {
    setIsKeyboardShortcutsOpen(false);
  }, []);
  
  // Image properties handlers
  const openImageProperties = useCallback((imageData) => {
    setSelectedImageData(imageData);
    setIsImagePropertiesOpen(true);
  }, []);
  
  const closeImageProperties = useCallback(() => {
    setIsImagePropertiesOpen(false);
    setSelectedImageData(null);
  }, []);
  
  // Fullscreen mode
  const toggleFullscreen = useCallback(() => {
    setIsFullscreenMode(prev => !prev);
  }, []);
  
  // Preview mode
  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode(prev => !prev);
    
    // Update editor editable state based on preview mode
    if (editor) {
      // We invert the current state since this will be applied after the state update
      const newPreviewState = !isPreviewMode;
      editor.setEditable(!newPreviewState);
    }
  }, [editor, isPreviewMode]);
  
  // Provide the editor and methods to children
  const value = {
    editor,
    saveContent,
    lastSaved,
    
    // Image dialog
    isImageDialogOpen,
    openImageDialog,
    closeImageDialog,
    
    // Emoji picker
    isEmojiPickerOpen,
    openEmojiPicker,
    closeEmojiPicker,
    
    // Table settings
    isTableSettingsOpen,
    openTableSettings,
    closeTableSettings,
    
    // Code block modal
    isCodeBlockModalOpen,
    openCodeBlockModal,
    closeCodeBlockModal,
    
    // Link modal
    isLinkModalOpen,
    openLinkModal,
    closeLinkModal,
    
    // Keyboard shortcuts modal
    isKeyboardShortcutsOpen,
    openKeyboardShortcuts,
    closeKeyboardShortcuts,
    
    // Image properties
    isImagePropertiesOpen,
    openImageProperties,
    closeImageProperties,
    selectedImageData,
    
    // Fullscreen mode
    isFullscreenMode,
    toggleFullscreen,
    
    // Preview mode
    isPreviewMode,
    togglePreviewMode,
  };
  
  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};
