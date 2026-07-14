'use client';

import { useEditorState as useTiptapEditorState } from '@tiptap/react';
import type { Editor } from '@tiptap/react';

/** Tiptap selection/mark 변경 시 툴바 active 상태를 갱신하기 위한 훅 */
export function useEditorState(editor: Editor | null): void {
  useTiptapEditorState({
    editor,
    selector: ({ transactionNumber }) => transactionNumber,
  });
}
