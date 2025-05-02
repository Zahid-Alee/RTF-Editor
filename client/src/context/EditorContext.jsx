import { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { useEditor as useTiptapEditor } from '@tiptap/react';
import { extensions } from '../lib/tiptapExtensions';
import { debounce } from '../lib/utils.jsx';
import { generateAiContent } from '../services/openAiService';
import { createLecture } from '../services/createLectureService.js';
import axios from 'axios';


export const EditorContext = createContext();

const STORAGE_KEY = 'tiptap-editor-content';

export const EditorProvider = ({ previewMode, course_id, section_id, lecture_id, children, editorMode = 'create' }) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [isCodeBlockModalOpen, setIsCodeBlockModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
  const [isImagePropertiesOpen, setIsImagePropertiesOpen] = useState(false);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(previewMode ?? false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);
  const [savingLecture, setSavingLecture] = useState(false);
  const [title, setTitle] = useState('Text Lecture');


  const getInitialContent = () => {

    if (typeof window === 'undefined') {
      return '';
    }

    const savedContent = localStorage.getItem(STORAGE_KEY);

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

  const editor = useTiptapEditor({
    extensions,
    content: getInitialContent(),
    editable: previewMode ? false : true,
    autofocus: 'end',
    onUpdate: ({ editor }) => {
      debouncedSave(editor);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  });

  const debouncedSave = useRef(
    debounce((editor) => {
      if (editor) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(editor.getJSON()));
        setLastSaved(new Date());
      }
    }, 1000)
  ).current;

  const saveContent = useCallback(() => {
    if (editor) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editor.getJSON()));
      setLastSaved(new Date());
    }
  }, [editor]);

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

  const openAiGenerator = useCallback(() => {
    setIsAiGeneratorOpen(true);
  }, []);

  const closeAiGenerator = useCallback(() => {
    setIsAiGeneratorOpen(false);
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



  const handleAiGenerate = useCallback(async (formData) => {
    try {

      const aiContent = await generateAiContent(formData);

      if (editor && aiContent) {
        editor.commands.clearContent();

        if (typeof aiContent === 'string') {
          editor.commands.setContent(aiContent, 'html');
        } else {
          editor.commands.setContent(aiContent);
        }
        saveContent();
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      throw error;
    }
  }, [editor, saveContent]);


  const saveLecture = async () => {

    setSavingLecture(true);
    const text = editor.getHTML();

    await createLecture({ course_id, lecture_id, section_id, content, text, title });
    setSavingLecture(false);

  }

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

    isAiGeneratorOpen,
    openAiGenerator,
    closeAiGenerator,
    handleAiGenerate,

    saveLecture,
    savingLecture,
    setSavingLecture,
    title,
    setTitle,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};
