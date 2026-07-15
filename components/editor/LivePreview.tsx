'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Chapter, ReaderThemeId, ThemeComponents } from '@/lib/types/book';
import { getResolvedThemeCss } from '@/lib/epub/resolveThemeTokens';

interface LivePreviewProps {
  chapter: Chapter | null;
  chapters: Chapter[];
  readerThemeId: ReaderThemeId;
  themeComponents?: ThemeComponents;
  onNavigate?: (chapterId: string) => void;
}

function scopeThemeCssForPreview(css: string): string {
  return css.replace(/\bbody\b/g, '.epub-preview-root');
}

export function LivePreview({
  chapter,
  chapters,
  readerThemeId,
  themeComponents,
  onNavigate,
}: LivePreviewProps) {
  const sorted = useMemo(
    () => [...chapters].sort((a, b) => a.order - b.order),
    [chapters],
  );

  const currentIndex = chapter
    ? sorted.findIndex((c) => c.id === chapter.id)
    : -1;

  const prevChapter = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const nextChapter =
    currentIndex >= 0 && currentIndex < sorted.length - 1
      ? sorted[currentIndex + 1]
      : null;

  const scopedCss = useMemo(
    () =>
      scopeThemeCssForPreview(
        getResolvedThemeCss({ readerThemeId, themeComponents }),
      ),
    [readerThemeId, themeComponents],
  );

  return (
    <section className="min-w-[280px] w-[400px] max-w-[50vw] bg-slate-200 flex flex-col shrink-0 h-full">
      <div className="flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600">
          실시간 미리보기
        </h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-3">
        {!chapter ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-slate-400 text-center">
              장을 선택하면 미리보기가 표시됩니다.
            </p>
          </div>
        ) : (
          <div
            key={`${chapter.id}-${readerThemeId}-${chapter.content.length}`}
            className="epub-preview-root bg-white rounded-lg shadow-sm p-6 min-h-full"
          >
            <style>{scopedCss}</style>
            <h1 className="chapter-title">{chapter.title}</h1>
            <div
              className="epub-preview-content"
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: chapter.content }}
            />
          </div>
        )}
      </div>

      <div className="shrink-0 flex justify-center gap-4 px-4 pb-3">
        <button
          type="button"
          disabled={!prevChapter}
          onClick={() => prevChapter && onNavigate?.(prevChapter.id)}
          className="p-2 rounded-full bg-white shadow-sm border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        <button
          type="button"
          disabled={!nextChapter}
          onClick={() => nextChapter && onNavigate?.(nextChapter.id)}
          className="p-2 rounded-full bg-white shadow-sm border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </section>
  );
}
