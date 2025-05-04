'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import TaskList from '@tiptap/extension-task-list';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { Underline } from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Text from '@tiptap/extension-text';
import { Collaboration } from '@tiptap/extension-collaboration';
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor';
import { ydoc, provider } from '@/lib/yjs-setup';
import { useEditorStore } from '@/store/use-editor-store';
import { Awareness } from 'y-protocols/awareness';

export const Editor = () => {
  const { setEditor } = useEditorStore();

  const userId = Math.random().toString(36).substring(2, 9);
  const userName = `User ${Math.floor(Math.random() * 100)}`;
  const userColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  const user = {
    id: userId,
    name: userName,
    color: userColor,
  };

  // Set up awareness for cursor tracking
  const awareness = provider.awareness;
  awareness.setLocalStateField('user', user);

  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor);

      // Update awareness with the user's cursor position
      editor.on('transaction', () => {
        const { anchor, head } = editor.state.selection;
        awareness.setLocalStateField('cursor', { anchor, head });
      });
    },
    onDestroy() {
      setEditor(null);
      awareness.setLocalState(null); // Clear awareness state when editor is destroyed
    },
    editorProps: {
      attributes: {
        style: 'padding-left: 56px; padding-right: 56px;',
        class: 'focus:outline-none print:border-0 bg-white border border-[#c7c7c7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
      },
    },
    extensions: [
      StarterKit,
      TaskList,
      Table,
      TableRow,
      TableCell,
      TableHeader,
      Image,
      Underline,
      Text,
      TextStyle,
      FontFamily,
      TaskItem.configure({
        nested: true,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          id: user.id,
          name: user.name,
          color: user.color,
        },
        render: (user) => {
          const label = document.createElement('div');
          label.style.position = 'absolute';
          label.style.backgroundColor = user.color;
          label.style.color = '#fff';
          label.style.padding = '4px 8px';
          label.style.borderRadius = '8px';
          label.style.fontSize = '12px';
          label.style.fontWeight = 'bold';
          label.style.whiteSpace = 'nowrap';
          label.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
          label.textContent = user.name;

          const pointer = document.createElement('div');
          pointer.style.position = 'absolute';
          pointer.style.top = '100%';
          pointer.style.left = '50%';
          pointer.style.transform = 'translateX(-50%)';
          pointer.style.width = '0';
          pointer.style.height = '0';
          pointer.style.borderLeft = '6px solid transparent';
          pointer.style.borderRight = '6px solid transparent';
          pointer.style.borderTop = `6px solid ${user.color}`;

          const container = document.createElement('div');
          container.style.position = 'absolute';
          container.style.transform = 'translate(-50%, -150%)'; // Adjusted to move above the cursor
          container.style.zIndex = '10'; // Ensure it appears above other elements
          container.appendChild(label);
          container.appendChild(pointer);

          return container;
        },
      }),
    ],
    immediatelyRender: false,
  });

  // Handle awareness changes
  awareness.on('change', () => {
    const states = awareness.getStates();
    states.forEach((state) => {
      if (state.cursor) {
        const { anchor, head } = state.cursor;
        // Update the cursor position dynamically in the editor
        // You can use this data to adjust the label position
        console.log(`Cursor updated: Anchor - ${anchor}, Head - ${head}`);
      }
    });
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="size-fill overflow-x-auto bg-[#f9fbfd] px-4 print:bg-white print:overflow-visible">
      <div className="min-w-max flex justify-center width-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
