import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import lowlight from './lowlightSetup';

// Combined extensions
export const extensions = [
  // Core editor features
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    codeBlock: false, // We'll use CodeBlockLowlight instead
  }),
  
  // Text formatting
  Underline,
  TextStyle,
  FontFamily,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  
  // Text alignment
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
  }),
  
  // Media and links
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      rel: 'noopener noreferrer',
    },
  }),
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  
  // Tables
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  
  // Task lists
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  
  // Code blocks with syntax highlighting
  CodeBlockLowlight.configure({
    lowlight,
  }),
  
  // Placeholder text
  Placeholder.configure({
    placeholder: 'Start writing or press / for commands...',
  }),
];
