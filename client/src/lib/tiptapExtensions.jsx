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
import { Extension } from '@tiptap/core';
import { CodeBlockCopy } from '../extensions/CodeBlockCopy';
// Custom extension for line height
const LineHeight = Extension.create({
  name: 'lineHeight',
  
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultHeight: '1.5'
    };
  },
  
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultHeight,
            parseHTML: element => element.style.lineHeight || this.options.defaultHeight,
            renderHTML: attributes => {
              if (!attributes.lineHeight) {
                return {};
              }
              
              return {
                style: `line-height: ${attributes.lineHeight}`
              };
            }
          }
        }
      }
    ];
  },
  
  addCommands() {
    return {
      setLineHeight: (lineHeight) => ({ commands }) => {
        // Apply to all selected nodes or current node if no selection
        return this.options.types.every(type => 
          commands.updateAttributes(type, { lineHeight: String(lineHeight) })
        );
      }
    };
  }
});

// Custom extension for word spacing
const WordSpacing = Extension.create({
  name: 'wordSpacing',
  
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultSpacing: '0em'
    };
  },
  
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          wordSpacing: {
            default: this.options.defaultSpacing,
            parseHTML: element => element.style.wordSpacing || this.options.defaultSpacing,
            renderHTML: attributes => {
              if (!attributes.wordSpacing) {
                return {};
              }
              
              return {
                style: `word-spacing: ${attributes.wordSpacing}`
              };
            }
          }
        }
      }
    ];
  },
  
  addCommands() {
    return {
      setWordSpacing: (wordSpacing) => ({ commands }) => {
        // Make sure we have the 'em' unit
        const value = wordSpacing.toString().includes('em') ? wordSpacing : `${wordSpacing}em`;
        
        // Apply to all selected nodes or current node if no selection
        return this.options.types.every(type => 
          commands.updateAttributes(type, { wordSpacing: value })
        );
      }
    };
  }
});

// Custom extension for letter spacing
const LetterSpacing = Extension.create({
  name: 'letterSpacing',
  
  addOptions() {
    return {
      types: ['paragraph', 'heading'], // Changed from textStyle to block nodes
      defaultSpacing: '0em'
    };
  },
  
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          letterSpacing: {
            default: this.options.defaultSpacing,
            parseHTML: element => element.style.letterSpacing || this.options.defaultSpacing,
            renderHTML: attributes => {
              if (!attributes.letterSpacing) {
                return {};
              }
              
              return {
                style: `letter-spacing: ${attributes.letterSpacing}`
              };
            }
          }
        }
      }
    ];
  },
  
  addCommands() {
    return {
      setLetterSpacing: (letterSpacing) => ({ commands }) => {
        // Make sure we have the 'em' unit
        const value = letterSpacing.toString().includes('em') ? letterSpacing : `${letterSpacing}em`;
        
        // Apply to all selected nodes or current node if no selection
        return this.options.types.every(type => 
          commands.updateAttributes(type, { letterSpacing: value })
        );
      }
    };
  }
});

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
  
  // Spacing controls
  LineHeight,
  WordSpacing,
  LetterSpacing,
  
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
  
  // Code blocks with syntax highlighting and copy button
  CodeBlockLowlight.configure({
    lowlight,
  }),
  CodeBlockCopy, // Add our new copy code extension
  
  // Placeholder text
  Placeholder.configure({
    placeholder: 'Start writing or press / for commands...',
  }),
];
