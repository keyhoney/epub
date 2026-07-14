'use client';

import { useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { LayoutTemplate, ChevronDown } from 'lucide-react';
import {
  BLOCK_TEMPLATE_GROUPS,
  buildFigureHtml,
  type BlockTemplate,
} from '@/lib/editor/blockTemplates';
import { cn } from '@/lib/utils';

interface BlockGalleryPopoverProps {
  editor: Editor;
  onImageSizeWarning?: (message: string) => void;
}

export function BlockGalleryPopover({
  editor,
  onImageSizeWarning,
}: BlockGalleryPopoverProps) {
  const [open, setOpen] = useState(false);
  const [groupId, setGroupId] = useState(BLOCK_TEMPLATE_GROUPS[0]?.id ?? '');
  const fileRef = useRef<HTMLInputElement>(null);

  const activeGroup =
    BLOCK_TEMPLATE_GROUPS.find((g) => g.id === groupId) ??
    BLOCK_TEMPLATE_GROUPS[0];

  const insert = (tpl: BlockTemplate) => {
    if (tpl.needsImageFile) {
      fileRef.current?.click();
      return;
    }
    editor.chain().focus().insertContent(tpl.html).run();
    setOpen(false);
  };

  const handleFigureFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      onImageSizeWarning?.('이미지는 10MB 이하여야 합니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const html = buildFigureHtml(reader.result as string, file.name);
      editor.chain().focus().insertContent(html).run();
      setOpen(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
        title="블록 삽입"
        aria-label="블록 삽입"
      >
        <LayoutTemplate className="w-4 h-4" />
        블록
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-slate-200 rounded-lg shadow-lg z-30 flex overflow-hidden">
          <div className="w-20 border-r border-slate-100 bg-slate-50 py-1 shrink-0">
            {BLOCK_TEMPLATE_GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroupId(g.id)}
                className={cn(
                  'w-full text-left px-2 py-1.5 text-[10px] font-medium',
                  groupId === g.id
                    ? 'bg-white text-blue-700'
                    : 'text-slate-600 hover:bg-white/70',
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="flex-1 p-2 max-h-64 overflow-y-auto space-y-1">
            {activeGroup.templates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => insert(tpl)}
                className="w-full text-left p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100"
              >
                {tpl.swatch && (
                  <div className="flex h-2 rounded overflow-hidden mb-1.5 border border-black/5">
                    {tpl.swatch.map((c, i) => (
                      <span key={i} className="flex-1" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                )}
                <span className="block text-sm text-slate-800">{tpl.label}</span>
                {tpl.description && (
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    {tpl.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFigureFile}
      />
    </div>
  );
}
