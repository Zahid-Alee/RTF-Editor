// Custom extension for adding copy button to code blocks
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export const CodeBlockCopy = Extension.create({
  name: 'codeBlockCopy',

  addOptions() {
    return {
      buttonHTML: `
        <button class="copy-code-button" title="Copy code">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
          </svg>
        </button>
      `,
      copyButtonClass: 'copy-code-button',
    };
  },

  addProseMirrorPlugins() {
    const { buttonHTML, copyButtonClass } = this.options;

    return [
      new Plugin({
        key: new PluginKey('codeBlockCopy'),
        props: {
          decorations(state) {
            const { doc } = state;
            const decorations = [];

            doc.descendants((node, pos) => {
              if (node.type.name === 'codeBlock') {
                const buttonElement = document.createElement('div');
                buttonElement.className = 'code-block-copy-wrapper';
                buttonElement.innerHTML = buttonHTML;
                
                // Add position to identify this specific code block
                buttonElement.dataset.position = pos;

                // Add a decoration at the start of the code block
                decorations.push(
                  Decoration.widget(pos, buttonElement, {
                    key: `copy-button-${pos}`,
                    side: 1, // Show at the top right
                  })
                );
              }
            });

            return DecorationSet.create(doc, decorations);
          },
          handleDOMEvents: {
            click(view, event) {
              // Check if we clicked on a copy button
              const button = event.target.closest(`.${copyButtonClass}`);
              if (!button) return false;

              // Find the wrapper to get position data
              const wrapper = button.closest('.code-block-copy-wrapper');
              if (!wrapper) return false;
              
              const pos = parseInt(wrapper.dataset.position, 10);
              if (isNaN(pos)) return false;

              // Get the code block and copy its text
              const node = view.state.doc.nodeAt(pos);
              if (!node || node.type.name !== 'codeBlock') return false;

              const text = node.textContent;
              navigator.clipboard.writeText(text).then(() => {
                // Show success feedback
                const originalHTML = button.innerHTML;
                button.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                `;
                button.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(() => {
                  button.innerHTML = originalHTML;
                  button.classList.remove('copied');
                }, 2000);
              });

              return true;
            },
          },
        },
      }),
    ];
  },
});