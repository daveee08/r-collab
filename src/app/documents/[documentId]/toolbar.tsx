'use client';

import { useState, useRef } from 'react';
import { useEditorStore } from '@/store/use-editor-store';
import { cn } from '@/lib/utils';
import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    Undo2Icon,
    Redo2Icon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ListIcon,
    ListOrderedIcon,
    ImageIcon,
    TableIcon,
    PrinterIcon,
    LucideIcon,
} from 'lucide-react';
import { TableGridSelector } from './TableGridSelector';

interface ToolbarButtonProps {
    onClick?: () => void;
    isActive?: boolean;
    icon: LucideIcon;
    refCallback?: (el: HTMLButtonElement) => void;
}

const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    refCallback,
}: ToolbarButtonProps) => (
    <button
        ref={refCallback}
        onClick={onClick}
        className={cn(
            'text-sm w-7 h-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80',
            isActive && 'bg-neutral-200/80'
        )}
    >
        <Icon className="size-4" />
    </button>
);

export const Toolbar = () => {
    const { editor } = useEditorStore();
    const [tablePopupOpen, setTablePopupOpen] = useState(false);
    const tableBtnRef = useRef<HTMLButtonElement>(null);

    const fontFamilies = [
        'Arial',
        'Georgia',
        'Times New Roman',
        'Verdana',
        'Courier New',
    ];

    const handleFontFamilyChange = (fontFamily: string) => {
        editor?.chain().focus().setFontFamily(fontFamily).run();
    };

    const buttons = [
        {
            label: 'Undo',
            icon: Undo2Icon,
            onClick: () => editor?.chain().focus().undo().run(),
        },
        {
            label: 'Redo',
            icon: Redo2Icon,
            onClick: () => editor?.chain().focus().redo().run(),
        },
        {
            label: 'Bold',
            icon: BoldIcon,
            onClick: () => editor?.chain().focus().toggleBold().run(),
            isActive: editor?.isActive('bold'),
        },
        {
            label: 'Italic',
            icon: ItalicIcon,
            onClick: () => editor?.chain().focus().toggleItalic().run(),
            isActive: editor?.isActive('italic'),
        },
        {
            label: 'Underline',
            icon: UnderlineIcon,
            onClick: () => editor?.chain().focus().toggleUnderline().run(),
            isActive: editor?.isActive('underline'),
        },
        {
            label: 'H1',
            icon: Heading1Icon,
            onClick: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: editor?.isActive('heading', { level: 1 }),
        },
        {
            label: 'H2',
            icon: Heading2Icon,
            onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor?.isActive('heading', { level: 2 }),
        },
        {
            label: 'H3',
            icon: Heading3Icon,
            onClick: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: editor?.isActive('heading', { level: 3 }),
        },
        {
            label: 'UL',
            icon: ListIcon,
            onClick: () => editor?.chain().focus().toggleBulletList().run(),
            isActive: editor?.isActive('bulletList'),
        },
        {
            label: 'OL',
            icon: ListOrderedIcon,
            onClick: () => editor?.chain().focus().toggleOrderedList().run(),
            isActive: editor?.isActive('orderedList'),
        },
        {
            label: 'Image',
            icon: ImageIcon,
            onClick: () => {
                const url = window.prompt('Enter image URL');
                if (url) editor?.chain().focus().setImage({ src: url }).run();
            },
        },
        {
            label: 'Insert Table',
            icon: TableIcon,
            onClick: () => setTablePopupOpen(true),
            refCallback: (el: HTMLButtonElement) => (tableBtnRef.current = el),
        },
        {
            label: 'Print',
            icon: PrinterIcon,
            onClick: () => window.print(),
        },
    ];

    return (
        <>
            <div className="relative w-full">
                <div className="bg-[#f1f4f9] px-2.5 py-0.5 min-h-[40px] flex items-center justify-center gap-x-2 overflow-x-auto">
                    {buttons.map((btn) => (
                        <ToolbarButton
                            key={btn.label}
                            onClick={btn.onClick}
                            isActive={btn.isActive}
                            icon={btn.icon}
                            refCallback={btn.refCallback}
                        />
                    ))}
                    <select
                        className="text-sm px-2 py-1 rounded-sm border border-neutral-300"
                        onChange={(e) => handleFontFamilyChange(e.target.value)}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Font Family
                        </option>
                        {fontFamilies.map((font) => (
                            <option key={font} value={font}>
                                {font}
                            </option>
                        ))}
                    </select>
                </div>

                {tablePopupOpen && (
                    <TableGridSelector
                        open={tablePopupOpen}
                        onClose={() => setTablePopupOpen(false)}
                        onInsert={(rows, cols) => {
                            editor
                                ?.chain()
                                .focus()
                                .insertTable({ rows, cols, withHeaderRow: true })
                                .run();
                            setTablePopupOpen(false);
                        }}
                        anchorRef={tableBtnRef}
                    />
                )}
            </div>
        </>
    );
};
