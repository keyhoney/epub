'use client';

import { useCallback } from 'react';
import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Rows3,
  Columns3,
  Merge,
  SplitSquareHorizontal,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableBubbleMenuProps {
  editor: Editor;
  onFocusTableStyle?: () => void;
}

function MenuButton({
  onClick,
  title,
  children,
  variant = 'default',
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={cn(
        'p-1.5 rounded transition-colors',
        variant === 'danger'
          ? 'text-red-600 hover:bg-red-50'
          : 'text-slate-600 hover:bg-slate-100',
      )}
    >
      {children}
    </button>
  );
}

export function TableBubbleMenu({
  editor,
  onFocusTableStyle,
}: TableBubbleMenuProps) {
  const shouldShow = useCallback(
    ({ editor: ed }: { editor: Editor }) => ed.isActive('table'),
    [],
  );

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg shadow-lg p-1 flex-wrap max-w-[320px]"
    >
      <MenuButton
        onClick={() => editor.chain().focus().addRowBefore().run()}
        title="위에 행 추가"
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="아래에 행 추가"
      >
        <ArrowDown className="w-3.5 h-3.5" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        title="왼쪽에 열 추가"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="오른쪽에 열 추가"
      >
        <ArrowRight className="w-3.5 h-3.5" />
      </MenuButton>

      <div className="w-px h-5 bg-slate-200 mx-0.5" />

      <MenuButton
        onClick={() => editor.chain().focus().deleteRow().run()}
        title="행 삭제"
      >
        <Rows3 className="w-3.5 h-3.5" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().deleteColumn().run()}
        title="열 삭제"
      >
        <Columns3 className="w-3.5 h-3.5" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        title="머리글 행 토글"
      >
        <span className="text-[10px] font-bold px-0.5">H</span>
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().mergeCells().run()}
        title="셀 병합"
      >
        <Merge className="w-3.5 h-3.5" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().splitCell().run()}
        title="셀 분할"
      >
        <SplitSquareHorizontal className="w-3.5 h-3.5" />
      </MenuButton>

      <div className="w-px h-5 bg-slate-200 mx-0.5" />

      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="셀 왼쪽 정렬"
      >
        <AlignLeft className="w-3.5 h-3.5" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="셀 가운데 정렬"
      >
        <AlignCenter className="w-3.5 h-3.5" />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="셀 오른쪽 정렬"
      >
        <AlignRight className="w-3.5 h-3.5" />
      </MenuButton>

      {onFocusTableStyle && (
        <MenuButton onClick={onFocusTableStyle} title="표 모양 (테마)">
          <Palette className="w-3.5 h-3.5" />
        </MenuButton>
      )}

      <div className="w-px h-5 bg-slate-200 mx-0.5" />

      <MenuButton
        onClick={() => editor.chain().focus().deleteTable().run()}
        title="표 삭제"
        variant="danger"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </MenuButton>
    </BubbleMenu>
  );
}
