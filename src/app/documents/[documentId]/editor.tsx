'use client'

import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { useEditor, EditorContent } from '@tiptap/react'

const Tiptap = () => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        style: 'padding-left: 56px; padding-right: 56px;',
        class: 'focus:outline-none print:border-0 bg-white border border-[#c7c7c7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text',
      },
    },
    extensions: [
        StarterKit,
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
    ],
    content: '<p>Hello World! 🌎️</p>',
  })

  return (
    <div className="size-fill  overflow-x-auto bg-[#f9fbfd] px-4 print:bg-white print:overflow-visible">
        <div className="min-w-max flex justify-center width-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
            <EditorContent editor={editor} />
        </div>
    </div>
  )
}

export default Tiptap
