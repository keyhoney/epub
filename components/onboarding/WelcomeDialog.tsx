'use client';

import { useState } from 'react';
import { BookOpen, HardDrive, FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ONBOARDING_STORAGE_KEY = 'epub_studio_onboarding_v1';

const STEPS = [
  {
    icon: BookOpen,
    title: '쓰세요',
    body: '왼쪽에서 장을 고르고, 가운데에서 본문을 쓰고, 오른쪽에서 미리보기를 확인하세요.',
  },
  {
    icon: HardDrive,
    title: '자동으로 남습니다',
    body: '같은 브라우저에서는 새로고침해도 작업이 유지됩니다. 중요한 원고는 「작업 파일」로도 보관하세요.',
  },
  {
    icon: FileDown,
    title: '두 가지 내보내기',
    body: '「작업 파일」은 나중에 이어서 쓰는 원고 백업이고, 「전자책 만들기」는 도서앱에서 읽는 .epub 완성본입니다.',
  },
] as const;

interface WelcomeDialogProps {
  onFinish: (opts: { skipTemplate?: boolean }) => void;
}

export function WelcomeDialog({ onFinish }: WelcomeDialogProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  const dismiss = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, '1');
  };

  const handleStart = () => {
    dismiss();
    onFinish({ skipTemplate: false });
  };

  const handleDontShow = () => {
    dismiss();
    onFinish({ skipTemplate: true });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
            ePub Studio
          </p>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{current.title}</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {current.body}
              </p>
            </div>
          </div>
          <div className="flex gap-1.5 mt-6 justify-center">
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}단계`}
                onClick={() => setStep(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === step ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-200',
                )}
              />
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleDontShow}
            className="text-sm text-slate-500 hover:text-slate-700 px-2 py-1.5"
          >
            다시 보지 않기
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                이전
              </button>
            )}
            {!isLast ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                다음
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStart}
                className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                시작하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
