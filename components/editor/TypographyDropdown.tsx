'use client';

import { useState } from 'react';
import type { Editor } from '@tiptap/react';
import { Type, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TypographyDropdownProps {
  editor: Editor;
}

export function TypographyDropdown({ editor }: TypographyDropdownProps) {
  const [open, setOpen] = useState(false);

  const blockType = editor.isActive('heading') ? 'heading' : 'paragraph';
  const blockClass = (editor.getAttributes(blockType).class as string) ?? '';

  const hasClass = (cls: string) => blockClass.split(/\s+/).includes(cls);

  const run = (cmd: () => void) => {
    cmd();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
        title="줄간격·자간·들여쓰기"
      >
        <Type className="w-4 h-4" />
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1 text-sm">
          <p className="px-3 py-1 text-[10px] font-semibold uppercase text-slate-400">줄간격</p>
          {[
            { label: '기본', cmd: () => editor.chain().focus().clearLineHeightClass().run(), check: () => !hasClass('line-height-normal') && !hasClass('line-height-relaxed') && !hasClass('line-height-loose') },
            { label: '보통 (1.5)', cls: 'line-height-normal', cmd: () => editor.chain().focus().setLineHeightNormal().run(), check: () => hasClass('line-height-normal') },
            { label: '넓게 (1.8)', cls: 'line-height-relaxed', cmd: () => editor.chain().focus().setLineHeightRelaxed().run(), check: () => hasClass('line-height-relaxed') },
            { label: '아주 넓게 (2.0)', cls: 'line-height-loose', cmd: () => editor.chain().focus().setLineHeightLoose().run(), check: () => hasClass('line-height-loose') },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => run(item.cmd)}
              className={cn(
                'w-full text-left px-3 py-1.5 hover:bg-slate-50',
                (item.check ? item.check() : false) && 'bg-blue-50 text-blue-700',
              )}
            >
              {item.label}
            </button>
          ))}

          <div className="border-t border-slate-100 my-1" />
          <p className="px-3 py-1 text-[10px] font-semibold uppercase text-slate-400">자간</p>
          {[
            { label: '기본', cls: '', cmd: () => editor.chain().focus().setLetterSpacingNormal().run(), check: () => !hasClass('letter-wide') },
            { label: '넓게', cls: 'letter-wide', cmd: () => editor.chain().focus().setLetterSpacingWide().run(), check: () => hasClass('letter-wide') },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => run(item.cmd)}
              className={cn(
                'w-full text-left px-3 py-1.5 hover:bg-slate-50',
                item.check() && 'bg-blue-50 text-blue-700',
              )}
            >
              {item.label}
            </button>
          ))}

          <div className="border-t border-slate-100 my-1" />
          <p className="px-3 py-1 text-[10px] font-semibold uppercase text-slate-400">들여쓰기</p>
          {[
            { label: '들여쓰기 1', cls: 'indent-1', cmd: () => editor.chain().focus().setIndent1().run() },
            { label: '들여쓰기 2', cls: 'indent-2', cmd: () => editor.chain().focus().setIndent2().run() },
            { label: '내어쓰기', cls: 'outdent', cmd: () => editor.chain().focus().setOutdent().run() },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => run(item.cmd)}
              className={cn(
                'w-full text-left px-3 py-1.5 hover:bg-slate-50',
                hasClass(item.cls) && 'bg-blue-50 text-blue-700',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
