'use client';

import { useRef } from 'react';
import { FolderOpen, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectFileActionsProps {
  onSaveToFile: () => void;
  onLoadFromFile: (file: File) => void;
  disabled?: boolean;
  emphasizeSave?: boolean;
}

export function ProjectFileActions({
  onSaveToFile,
  onLoadFromFile,
  disabled,
  emphasizeSave,
}: ProjectFileActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadFromFile(file);
    }
    e.target.value = '';
  };

  return (
    <>
      <button
        type="button"
        onClick={onSaveToFile}
        disabled={disabled}
        aria-label="작업 저장하기"
        title="나중에 이어서 쓰려면 이 파일을 보관하세요"
        className={cn(
          'px-3 py-1.5 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed',
          emphasizeSave && 'border-amber-400 ring-2 ring-amber-200 animate-pulse',
        )}
      >
        <Save className="w-4 h-4" />
        작업 저장하기
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        aria-label="작업 불러오기"
        title=".epubstudio.json 열기"
        className="px-3 py-1.5 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FolderOpen className="w-4 h-4" />
        작업 불러오기
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".epubstudio.json,.json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}
