'use client';

import { useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Highlighter,
  Link as LinkIcon,
  Eraser,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextBubbleMenuProps {
  editor: Editor;
  advanced?: boolean;
  onOpenLink?: () => void;
}

function Btn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn(
        'p-1.5 rounded',
        active ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100',
      )}
    >
      {children}
    </button>
  );
}

export function TextBubbleMenu({
  editor,
  advanced,
  onOpenLink,
}: TextBubbleMenuProps) {
  const shouldShow = useCallback(
    ({ editor: ed }: { editor: Editor }) => {
      const { empty } = ed.state.selection;
      if (empty) return false;
      if (ed.isActive('table') || ed.isActive('image') || ed.isActive('codeBlock')) {
        return false;
      }
      return true;
    },
    [],
  );

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg shadow-lg p-1 z-30"
    >
      <Btn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="굵게"
      >
        <Bold className="w-3.5 h-3.5" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="기울임"
      >
        <Italic className="w-3.5 h-3.5" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        title="밑줄"
      >
        <UnderlineIcon className="w-3.5 h-3.5" />
      </Btn>
      <Btn
        onClick={() =>
          editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()
        }
        active={editor.isActive('highlight')}
        title="형광펜"
      >
        <Highlighter className="w-3.5 h-3.5" />
      </Btn>
      <Btn
        onClick={() => onOpenLink?.()}
        active={editor.isActive('link')}
        title="링크"
      >
        <LinkIcon className="w-3.5 h-3.5" />
      </Btn>
      {advanced && (
        <Btn
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          title="서식 지우기"
        >
          <Eraser className="w-3.5 h-3.5" />
        </Btn>
      )}
    </BubbleMenu>
  );
}
