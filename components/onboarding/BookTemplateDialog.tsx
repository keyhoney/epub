'use client';

import { BOOK_TEMPLATES, type BookTemplateId } from '@/lib/templates/bookTemplates';
import { cn } from '@/lib/utils';

interface BookTemplateDialogProps {
  onSelect: (id: BookTemplateId) => void;
  onCancel: () => void;
  title?: string;
}

export function BookTemplateDialog({
  onSelect,
  onCancel,
  title = '어떤 책으로 시작할까요?',
}: BookTemplateDialogProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            나중에 「새 책으로」에서 언제든 다시 고를 수 있습니다.
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BOOK_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl.id)}
              className={cn(
                'text-left rounded-xl border border-slate-200 p-4 hover:border-blue-400 hover:bg-blue-50/50 transition-colors',
              )}
            >
              <span className="block text-sm font-semibold text-slate-900">
                {tpl.name}
              </span>
              <span className="block mt-1 text-xs text-slate-500 leading-relaxed">
                {tpl.description}
              </span>
            </button>
          ))}
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
