'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Download, FilePlus2 } from 'lucide-react';
import { Toast, useToast } from '@/components/ui/Toast';
import { useBookState } from '@/hooks/useBookState';
import { estimateDataUrlSize } from '@/lib/epub/extractImages';
import { ProjectFileActions } from '@/components/editor/ProjectFileActions';
import {
  WelcomeDialog,
  ONBOARDING_STORAGE_KEY,
} from '@/components/onboarding/WelcomeDialog';
import { BookTemplateDialog } from '@/components/onboarding/BookTemplateDialog';
import type { BookTemplateId } from '@/lib/templates/bookTemplates';
import { cn } from '@/lib/utils';

const ChapterSidebar = dynamic(
  () =>
    import('@/components/editor/ChapterSidebar').then((m) => ({
      default: m.ChapterSidebar,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="w-72 border-r border-slate-200 bg-white shrink-0 h-full" />
    ),
  },
);

const TiptapEditor = dynamic(
  () =>
    import('@/components/editor/TiptapEditor').then((m) => ({
      default: m.TiptapEditor,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm bg-white">
        에디터 로딩 중...
      </div>
    ),
  },
);

const LivePreview = dynamic(
  () =>
    import('@/components/editor/LivePreview').then((m) => ({
      default: m.LivePreview,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="w-80 bg-slate-200 shrink-0 h-full" />
    ),
  },
);

type MobilePane = 'structure' | 'edit' | 'preview';

export default function EpubStudioClient() {
  const {
    bookState,
    sortedChapters,
    selectedChapter,
    selectedChapterId,
    setSelectedChapterId,
    lastSavedTime,
    isLoaded,
    updateMetadata,
    setReaderThemeId,
    updateThemeComponent,
    applyTemplate,
    addChapter,
    deleteChapter,
    updateChapterTitle,
    updateChapterContent,
    reorderChaptersList,
    saveProjectToFile,
    loadProjectFromFile,
    saveStatus,
    saveError,
  } = useBookState();

  const { message: toastMessage, showToast } = useToast();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [themeFocusKey, setThemeFocusKey] = useState<string | null>(null);
  const [mobilePane, setMobilePane] = useState<MobilePane>('edit');
  const backupNudgeShown = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!localStorage.getItem(ONBOARDING_STORAGE_KEY)) {
      setShowWelcome(true);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || backupNudgeShown.current) return;
    let total = 0;
    bookState.chapters.forEach((ch) => {
      const matches = ch.content.match(/data:image\/[^"']+/gi) ?? [];
      matches.forEach((url) => {
        total += estimateDataUrlSize(url);
      });
    });
    if (total > 15 * 1024 * 1024) {
      backupNudgeShown.current = true;
      showToast('이미지가 많습니다. 「작업 파일」로 백업해 두세요');
    }
  }, [bookState.chapters, isLoaded, showToast]);

  const handleNewBook = () => {
    if (
      !window.confirm(
        '현재 작업을 새 책으로 바꿀까요? 저장하지 않은 내용은 사라질 수 있습니다.',
      )
    ) {
      return;
    }
    setShowTemplate(true);
  };

  const handleTemplateSelect = async (id: BookTemplateId) => {
    setShowTemplate(false);
    await applyTemplate(id);
    showToast('새 책 템플릿이 적용되었습니다');
  };

  const handleSaveProject = () => {
    saveProjectToFile();
    showToast('작업 파일이 저장되었습니다');
  };

  const handleLoadProject = async (file: File) => {
    if (
      !window.confirm(
        '불러오면 현재 작업 내용이 대체됩니다. 계속하시겠습니까?',
      )
    ) {
      return;
    }

    try {
      await loadProjectFromFile(file);
      showToast('작업을 불러왔습니다');
    } catch (err) {
      showToast(err instanceof Error ? err.message : '불러오기에 실패했습니다');
    }
  };

  const handleDownload = async () => {
    const { runExportPreflight } = await import('@/lib/epub/exportPreflight');
    const preflight = runExportPreflight(bookState);
    if (preflight.blocker) {
      showToast(preflight.blocker);
      return;
    }
    if (preflight.warnings.length > 0) {
      const ok = window.confirm(
        `${preflight.warnings.join('\n')}\n\n그래도 전자책을 만들까요?`,
      );
      if (!ok) return;
    }

    let totalImageSize = 0;
    if (bookState.metadata.coverImage) {
      totalImageSize += estimateDataUrlSize(bookState.metadata.coverImage);
    }
    bookState.chapters.forEach((ch) => {
      const matches = ch.content.match(/data:image\/[^"']+/gi) ?? [];
      matches.forEach((url) => {
        totalImageSize += estimateDataUrlSize(url);
      });
    });

    if (totalImageSize > 50 * 1024 * 1024) {
      showToast('전체 이미지 용량이 50MB를 초과합니다');
      return;
    }

    try {
      const { downloadEpub } = await import('@/lib/epub/buildEpub');
      await downloadEpub(bookState);
      showToast(
        '전자책이 준비되었습니다. 도서 앱이나 Calibre에서 열어 확인하세요.',
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : '다운로드에 실패했습니다');
    }
  };

  const handleAddChapter = () => {
    addChapter();
    showToast('새 장이 추가되었습니다');
  };

  const handleDeleteChapter = (id: string) => {
    if (bookState.chapters.length <= 1) {
      showToast('최소 1개의 장이 필요합니다');
      return;
    }
    deleteChapter(id);
    showToast('장이 삭제되었습니다');
  };

  const handleThemeChange = (themeId: typeof bookState.readerThemeId) => {
    setReaderThemeId(themeId);
    showToast('읽기 테마가 적용되었습니다');
  };

  const handleFocusTableStyle = () => {
    setThemeFocusKey('table');
    setMobilePane('structure');
    setTimeout(() => setThemeFocusKey(null), 800);
  };

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans text-slate-900">
      <Toast message={toastMessage} />

      {showWelcome && (
        <WelcomeDialog
          onFinish={({ skipTemplate }) => {
            setShowWelcome(false);
            if (!skipTemplate) setShowTemplate(true);
          }}
        />
      )}

      {showTemplate && (
        <BookTemplateDialog
          onSelect={(id) => void handleTemplateSelect(id)}
          onCancel={() => setShowTemplate(false)}
        />
      )}

      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-6 shrink-0 z-10 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight truncate">
            ePub Studio{' '}
            <span className="text-slate-400 font-normal hidden sm:inline">
              EPUB 3.0
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap justify-end">
          <div className="text-[10px] sm:text-xs mr-0 sm:mr-1 text-right leading-tight hidden sm:block">
            {saveStatus === 'saving' && (
              <span className="text-slate-400">저장 중…</span>
            )}
            {saveStatus === 'saved' && lastSavedTime && (
              <span className="text-slate-400">
                브라우저에 저장됨 · {lastSavedTime}
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-amber-600" title={saveError ?? undefined}>
                저장 실패 — 작업 파일로 백업하세요
              </span>
            )}
          </div>
          <ProjectFileActions
            onSaveToFile={handleSaveProject}
            onLoadFromFile={(file) => void handleLoadProject(file)}
            emphasizeSave={saveStatus === 'error'}
          />
          <button
            type="button"
            onClick={handleNewBook}
            aria-label="새 책으로"
            title="확인 후 템플릿 선택"
            className="px-2.5 sm:px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 border border-red-200"
          >
            <FilePlus2 className="w-4 h-4" />
            <span className="hidden sm:inline">새 책으로</span>
          </button>
          <button
            type="button"
            onClick={() => void handleDownload()}
            aria-label="전자책 만들기"
            title="스마트폰·도서앱에서 읽는 .epub"
            className="px-2.5 sm:px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">전자책 만들기</span>
          </button>
        </div>
      </header>

      <div className="lg:hidden flex border-b border-slate-200 bg-white shrink-0">
        {(
          [
            ['structure', '구조'],
            ['edit', '편집'],
            ['preview', '미리보기'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMobilePane(id)}
            className={cn(
              'flex-1 py-2 text-sm font-medium',
              mobilePane === id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <main className="flex-1 flex overflow-hidden">
        <div
          className={cn(
            'h-full',
            mobilePane === 'structure' ? 'flex' : 'hidden',
            'lg:flex',
          )}
        >
          <ChapterSidebar
            metadata={bookState.metadata}
            chapters={sortedChapters}
            selectedChapterId={selectedChapterId}
            readerThemeId={bookState.readerThemeId}
            themeComponents={bookState.themeComponents}
            themeFocusKey={themeFocusKey}
            onMetadataChange={updateMetadata}
            onThemeChange={handleThemeChange}
            onThemeComponentChange={updateThemeComponent}
            onSelectChapter={setSelectedChapterId}
            onAddChapter={handleAddChapter}
            onDeleteChapter={handleDeleteChapter}
            onUpdateChapterTitle={updateChapterTitle}
            onReorderChapters={reorderChaptersList}
          />
        </div>

        <div
          className={cn(
            'flex-1 min-w-0 h-full',
            mobilePane === 'edit' ? 'flex' : 'hidden',
            'lg:flex',
          )}
        >
          <TiptapEditor
            chapterId={selectedChapterId}
            content={selectedChapter?.content ?? ''}
            chapters={sortedChapters}
            onUpdate={(html) => {
              if (selectedChapterId) {
                updateChapterContent(selectedChapterId, html);
              }
            }}
            onChapterContentReplace={updateChapterContent}
            onNavigateToChapter={setSelectedChapterId}
            onImageSizeWarning={(msg) => showToast(msg)}
            onFocusTableStyle={handleFocusTableStyle}
          />
        </div>

        <div
          className={cn(
            'h-full',
            mobilePane === 'preview' ? 'flex' : 'hidden',
            'lg:flex',
          )}
        >
          <LivePreview
            chapter={selectedChapter}
            chapters={sortedChapters}
            readerThemeId={bookState.readerThemeId}
            themeComponents={bookState.themeComponents}
            onNavigate={setSelectedChapterId}
          />
        </div>
      </main>
    </div>
  );
}
