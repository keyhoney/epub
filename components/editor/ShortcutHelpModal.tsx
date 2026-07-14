'use client';

import { X } from 'lucide-react';

const BASIC_SHORTCUTS = [
  { keys: 'Ctrl + B', action: '굵게' },
  { keys: 'Ctrl + I', action: '기울임' },
  { keys: 'Ctrl + U', action: '밑줄' },
  { keys: 'Ctrl + Z', action: '실행 취소' },
  { keys: 'Ctrl + Shift + Z', action: '다시 실행' },
  { keys: 'Ctrl + K', action: '링크 삽입' },
];

const ADVANCED_SHORTCUTS = [
  { keys: 'Ctrl + F', action: '찾기 및 바꾸기' },
  { keys: 'Ctrl + Shift + 7', action: '번호 목록' },
  { keys: 'Ctrl + Shift + 8', action: '글머리 목록' },
];

interface ShortcutHelpModalProps {
  onClose: () => void;
}

export function ShortcutHelpModal({ onClose }: ShortcutHelpModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-[360px] max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">단축키 안내</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <p className="text-xs font-semibold text-slate-500 mb-2">기본</p>
        <ul className="space-y-2 mb-4">
          {BASIC_SHORTCUTS.map((item) => (
            <li
              key={item.keys}
              className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 last:border-0"
            >
              <span className="text-slate-600">{item.action}</span>
              <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-700">
                {item.keys}
              </kbd>
            </li>
          ))}
        </ul>
        <p className="text-xs font-semibold text-slate-500 mb-2">고급</p>
        <ul className="space-y-2">
          {ADVANCED_SHORTCUTS.map((item) => (
            <li
              key={item.keys}
              className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 last:border-0"
            >
              <span className="text-slate-600">{item.action}</span>
              <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-700">
                {item.keys}
              </kbd>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
