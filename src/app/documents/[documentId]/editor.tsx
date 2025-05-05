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
import { ydoc } from '@/lib/yjs-setup';
import { useEditorStore } from '@/store/use-editor-store';
import { useEffect, useMemo, useState } from 'react';


export const Editor = () => {
  const { setEditor } = useEditorStore();
  const [remoteCursors, setRemoteCursors] = useState<
    { id: string; x: number; y: number; name: string; color: string }[]
  >([]);

  const userInfo = useMemo(() => {
    const id = Math.random().toString(36).substring(2, 9);
    return {
      userId: id,
      userName: `User-${id}`,
      userColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };
  }, []);

  const { userId, userName, userColor } = userInfo;

  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    editorProps: {
      attributes: {
        style: 'padding-left: 56px; padding-right: 56px;',
        class:
          'focus:outline-none print:border-0 bg-white border border-[#c7c7c7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
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
      TaskItem.configure({ nested: true }),
      Collaboration.configure({ document: ydoc }),
    ],
    immediatelyRender: false,
  });

  useEffect(() => {
    // Connect to the Yjs WebSocket server
    const yjsWs = new WebSocket('ws://localhost:1234');

    // Connect to the cursor WebSocket server
    const cursorWs = new WebSocket('ws://localhost:5678');

    const handleMouseMove = (event: MouseEvent) => {
      const editorElement = document.querySelector('.ProseMirror');
      if (!editorElement) return;

      const rect = editorElement.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const relativeY = event.clientY - rect.top;

      const mousePosition = {
        id: userId,
        x: relativeX,
        y: relativeY,
        name: userName,
        color: userColor,
      };

      if (cursorWs.readyState === WebSocket.OPEN) {
        cursorWs.send(JSON.stringify(mousePosition)); // Send cursor data to the cursor server
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    cursorWs.onmessage = (event) => {
      const data = JSON.parse(event.data); // Parse cursor data
      setRemoteCursors((prev) => {
        const updated = prev.filter((cursor) => cursor.id !== data.id);
        return [...updated, data];
      });
    };

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      yjsWs.close();
      cursorWs.close();
    };
  }, [userId, userName, userColor]);

  if (!editor) return null;

  return (
    <div className="size-fill overflow-x-auto bg-[#f9fbfd] px-4 print:bg-white print:overflow-visible">
      <div className="min-w-max flex justify-center py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <div className="relative w-[816px]">
          <EditorContent editor={editor} />
          {remoteCursors
            .filter((cursor) => cursor.id !== userId)
            .map((cursor) => (
              <div
                key={cursor.id}
                style={{
                  position: 'absolute',
                  left: `${cursor.x}px`,
                  top: `${cursor.y}px`,
                  backgroundColor: cursor.color,
                  color: '#fff',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  fontSize: '12px',
                  zIndex: 50,
                }}
              >
                {cursor.name}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Editor;
