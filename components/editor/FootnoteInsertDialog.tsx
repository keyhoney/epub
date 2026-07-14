'use client';

import { useState } from 'react';
import type { Editor } from '@tiptap/react';
import { X } from 'lucide-react';
import { insertFootnote } from '@/lib/editor/footnoteHelpers';

interface FootnoteInsertDialogProps {
  editor: Editor;
  chapterHtml: string;
  onClose: () => void;
}

export function FootnoteInsertDialog({
  editor,
  chapterHtml,
  onClose,
}: FootnoteInsertDialogProps) {
  const [body, setBody] = useState('');

  const handleInsert = () => {
    if (!body.trim()) return;
    insertFootnote(editor, body.trim(), chapterHtml);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-5 w-96 max-w-[90vw]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800">각주 삽입</h3>
          <button type="button" onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mb-2">
          커서 위치에 각주 번호가 삽입되고, 본문 끝에 각주 블록이 추가됩니다.
        </p>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none"
          placeholder="각주 내용을 입력하세요"
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleInsert}
            disabled={!body.trim()}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            삽입
          </button>
        </div>
      </div>
    </div>
  );
}
