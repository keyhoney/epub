'use client';

import { useState } from 'react';
import type { Editor } from '@tiptap/react';
import { Omega } from 'lucide-react';
import { SPECIAL_CHAR_GROUPS } from '@/lib/editor/specialCharacters';

interface SpecialCharPopoverProps {
  editor: Editor;
}

export function SpecialCharPopover({ editor }: SpecialCharPopoverProps) {
  const [open, setOpen] = useState(false);

  const insert = (ch: string) => {
    editor.chain().focus().insertContent(ch).run();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded text-slate-600 hover:bg-slate-100 cursor-pointer"
        title="특수문자"
      >
        <Omega className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-30 p-2 max-h-64 overflow-y-auto">
          {SPECIAL_CHAR_GROUPS.map((group) => (
            <div key={group.label} className="mb-2">
              <p className="text-[10px] font-semibold text-slate-400 mb-1">{group.label}</p>
              <div className="flex flex-wrap gap-1">
                {group.chars.map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => insert(ch)}
                    className="w-8 h-8 text-sm border border-slate-200 rounded hover:bg-blue-50"
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
