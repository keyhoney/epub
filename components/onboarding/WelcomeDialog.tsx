'use client';

import { useState } from 'react';
import { BookOpen, HardDrive, FileDown, Sparkles, ArrowRight, BookMarked, Palette, Menu, PenLine, Eye, Library } from 'lucide-react';

const GUIDE_STEPS = [
  {
    icon: Library,
    title: '책 정보 입력하기',
    body: '책의 제목, 저자, 언어, 발행일 등 메타데이터를 입력합니다. ISBN과 시리즈 정보도 설정할 수 있어요.',
    img: '/imgs/bookInfo.png',
  },
  {
    icon: BookMarked,
    title: '장 목록 편집하기',
    body: '왼쪽 사이드바에서 장을 추가·삭제·순서 변경할 수 있습니다. 각 장의 제목을 클릭하면 바로 수정할 수 있어요.',
    img: '/imgs/chapterInfo.png',
  },
  {
    icon: Palette,
    title: '테마 변경하기',
    body: '36가지 다양한 테마 중에서 책의 분위기에 맞는 스타일을 고르세요. 표, 인용구, 첫글자 장식 등 세부 요소도 따로 설정할 수 있습니다.',
    img: '/imgs/themeInfo.png',
  },
  {
    icon: Menu,
    title: '상단 메뉴 사용하기',
    body: '상단에서 「작업 저장하기」로 원고를 백업하고, 「작업 불러오기」로 이어서 편집하세요. 「전자책 만들기」로 .epub 파일을 내보낼 수 있습니다.',
    img: '/imgs/menuInfo.png',
  },
  {
    icon: PenLine,
    title: '에디터 도구 익히기',
    body: '에디터 상단 도구모음에서 글꼴 스타일, 정렬, 표, 이미지, 인용구 등을 자유롭게 사용할 수 있습니다. 고급 모드에서는 더 다양한 기능을 쓸 수 있어요.',
    img: '/imgs/editorInfo.png',
  },
  {
    icon: Eye,
    title: '실시간 미리보기',
    body: '오른쪽 패널에서 작성 중인 내용을 전자책 형태로 실시간 확인하세요. 테마 변경, 장 이동도 미리보기에 즉시 반영됩니다.',
    img: '/imgs/pageviewInfo.png',
  },
] as const;

interface WelcomeDialogProps {
  onFinish: (opts: { skipTemplate?: boolean }) => void;
}

export function WelcomeDialog({ onFinish }: WelcomeDialogProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  const handleStart = () => {
    onFinish({ skipTemplate: false });
  };

  const handleStartWithoutTemplate = () => {
    onFinish({ skipTemplate: true });
  };

  if (showGuide) {
    const current = GUIDE_STEPS[guideStep];
    const Icon = current.icon;
    const isLast = guideStep === GUIDE_STEPS.length - 1;

    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                시작 가이드 {guideStep + 1} / {GUIDE_STEPS.length}
              </p>
              <div className="flex gap-1.5">
                {GUIDE_STEPS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${i + 1}단계`}
                    onClick={() => setGuideStep(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === guideStep ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{current.title}</h2>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  {current.body}
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={current.img}
                alt={current.title}
                className="w-full h-auto object-contain"
                style={{ maxHeight: '60vh' }}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => setShowGuide(false)}
            className="text-sm text-slate-500 hover:text-slate-700 px-2 py-1.5"
          >
            ← 목록으로
          </button>
          <div className="flex gap-2">
            {guideStep > 0 && (
              <button
                type="button"
                onClick={() => setGuideStep((s) => s - 1)}
                className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                이전
              </button>
            )}
            {!isLast ? (
              <button
                type="button"
                onClick={() => setGuideStep((s) => s + 1)}
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
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-9 h-9 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            ePub Studio
          </h1>
          <p className="text-lg text-slate-500 mb-2">
            전자책을 만드는 가장 쉬운 방법
          </p>
          <p className="text-sm text-slate-400 mb-10 max-w-md mx-auto text-center leading-relaxed">
            WYSIWYG 에디터로 EPUB 3.0 형식의 전자책을 작성하고, 테마를 고르고, 바로 .epub 파일로 내보내세요. 별도 설치 없이 브라우저만 있으면 됩니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={handleStart}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-base font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              바로 시작하기
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowGuide(true)}
              className="px-6 py-3 bg-white text-slate-700 rounded-xl text-base font-medium hover:bg-slate-50 transition-colors border border-slate-200 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              시작 가이드 보기
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-6 py-3 flex items-center justify-between shrink-0">
        <span className="text-xs text-slate-400">EPUB 3.0 Online Editor</span>
        <button
          type="button"
          onClick={handleStartWithoutTemplate}
          className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
        >
          빈 페이지로 시작
        </button>
      </div>
    </div>
  );
}
