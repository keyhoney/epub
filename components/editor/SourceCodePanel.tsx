'use client';

import { useEffect, useState } from 'react';
import { X, Check } from 'lucide-react';

interface SourceCodePanelProps {
  html: string;
  onApply: (html: string) => void;
  onClose: () => void;
  onError?: (message: string) => void;
}

export function SourceCodePanel({
  html,
  onApply,
  onClose,
  onError,
}: SourceCodePanelProps) {
  const [source, setSource] = useState(html);

  useEffect(() => {
    setSource(html);
  }, [html]);

  const handleApply = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div>${source}</div>`, 'text/html');
      const err = doc.querySelector('parsererror');
      if (err) {
        onError?.('HTML 구문이 올바르지 않습니다.');
        return;
      }
      onApply(source);
      onClose();
    } catch {
      onError?.('HTML을 적용할 수 없습니다.');
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-20 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
        <span className="text-xs font-semibold text-slate-600">HTML 소스 편집</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded"
          >
            <Check className="w-3 h-3" />
            적용
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <textarea
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none"
        spellCheck={false}
      />
    </div>
  );
}
