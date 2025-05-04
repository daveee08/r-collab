import { create } from "zustand";
import type { Editor as TipTapEditor } from '@tiptap/react';

interface EditorState {
    editor: TipTapEditor | null;
    setEditor: (editor: TipTapEditor | null) => void;
};


export const useEditorStore = create<EditorState>((set) => ({
    editor: null,
    setEditor: (editor) => set({ editor }),
}));