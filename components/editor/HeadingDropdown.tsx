'use client';

import { useState } from 'react';
import type { Editor } from '@tiptap/react';
import { ChevronDown, Pilcrow } from 'lucide-react';
import { cn } from '@/lib/utils';

const HEADING_OPTIONS = [
  { level: 0, label: '본문', short: '¶' },
  { level: 2, label: '제목 2', short: 'H2' },
  { level: 3, label: '제목 3', short: 'H3' },
  { level: 4, label: '제목 4', short: 'H4' },
] as const;

interface HeadingDropdownProps {
  editor: Editor;
}

export function HeadingDropdown({ editor }: HeadingDropdownProps) {
  const [open, setOpen] = useState(false);

  const activeLevel = editor.isActive('heading', { level: 2 })
    ? 2
    : editor.isActive('heading', { level: 3 })
      ? 3
      : editor.isActive('heading', { level: 4 })
        ? 4
        : 0;

  const current = HEADING_OPTIONS.find((o) => o.level === activeLevel)!;

  const apply = (level: number) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: level as 2 | 3 | 4 }).run();
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded cursor-pointer min-w-[52px]',
          activeLevel > 0
            ? 'bg-blue-100 text-blue-700'
            : 'text-slate-600 hover:bg-slate-100',
        )}
        title="제목 스타일"
      >
        <span className="font-semibold">{current.short}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1">
          {HEADING_OPTIONS.map((opt) => (
            <button
              key={opt.level}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => apply(opt.level)}
              className={cn(
                'w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2',
                activeLevel === opt.level && 'bg-blue-50 text-blue-700',
              )}
            >
              {opt.level === 0 ? (
                <Pilcrow className="w-3.5 h-3.5" />
              ) : (
                <span className="text-[10px] font-bold w-3.5 text-center">{opt.short}</span>
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
