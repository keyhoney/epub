'use client';

import { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import type { Chapter } from '@/lib/types/book';
import { extractHeadings } from '@/lib/epub/extractHeadings';

interface LinkPopoverProps {
  editor: Editor;
  chapters: Chapter[];
  currentChapterId: string | null;
  onClose: () => void;
}

export function LinkPopover({
  editor,
  chapters,
  currentChapterId,
  onClose,
}: LinkPopoverProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<'external' | 'internal'>('external');
  const [url, setUrl] = useState(
    (editor.getAttributes('link').href as string) || 'https://',
  );
  const [targetChapterId, setTargetChapterId] = useState(
    currentChapterId ?? chapters[0]?.id ?? '',
  );
  const [anchorId, setAnchorId] = useState('');

  const sorted = [...chapters].sort((a, b) => a.order - b.order);
  const targetChapter = sorted.find((c) => c.id === targetChapterId);
  const chapterIndex = sorted.findIndex((c) => c.id === targetChapterId);
  const headings = targetChapter ? extractHeadings(targetChapter.content) : [];

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [tab]);

  const applyLink = () => {
    if (tab === 'external') {
      if (!url.trim()) {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url.trim() })
          .run();
      }
    } else if (chapterIndex >= 0) {
      const base = `chapter${chapterIndex + 1}.xhtml`;
      const href = anchorId ? `${base}#${anchorId}` : base;
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    }
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-1 z-30 p-3 bg-white border border-slate-200 rounded-lg shadow-lg w-80">
      <div className="flex gap-1 mb-3">
        {(['external', 'internal'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-1 text-xs rounded ${
              tab === t ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {t === 'external' ? '외부' : '장 내부'}
          </button>
        ))}
      </div>

      {tab === 'external' ? (
        <>
          <label className="block text-xs text-slate-500 mb-1">링크 URL</label>
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyLink();
              }
              if (e.key === 'Escape') onClose();
            }}
            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="https://"
          />
        </>
      ) : (
        <div className="space-y-2">
          <label className="block text-xs text-slate-500">이동할 장</label>
          <select
            value={targetChapterId}
            onChange={(e) => {
              setTargetChapterId(e.target.value);
              setAnchorId('');
            }}
            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md"
          >
            {sorted.map((ch, i) => (
              <option key={ch.id} value={ch.id}>
                {i + 1}장. {ch.title}
              </option>
            ))}
          </select>
          {headings.length > 0 && (
            <>
              <label className="block text-xs text-slate-500">섹션 (선택)</label>
              <select
                value={anchorId}
                onChange={(e) => setAnchorId(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-md"
              >
                <option value="">장 시작</option>
                {headings.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.level === 2 ? '§ ' : '  · '}
                    {h.text}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            onClose();
          }}
          className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
        >
          제거
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded"
        >
          취소
        </button>
        <button
          type="button"
          onClick={applyLink}
          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          적용
        </button>
      </div>
    </div>
  );
}
