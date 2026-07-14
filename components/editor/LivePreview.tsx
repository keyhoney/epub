'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Chapter, ReaderThemeId, ThemeComponents } from '@/lib/types/book';
import { getResolvedThemeCss } from '@/lib/epub/resolveThemeTokens';
import { cn } from '@/lib/utils';

interface LivePreviewProps {
  chapter: Chapter | null;
  chapters: Chapter[];
  readerThemeId: ReaderThemeId;
  themeComponents?: ThemeComponents;
  onNavigate?: (chapterId: string) => void;
}

const VIEWPORT_PRESETS = [
  { id: 'default', label: '기본', width: 280 },
  { id: 'phone', label: '스마트폰', width: 375 },
  { id: 'tablet', label: '태블릿', width: 768 },
  { id: 'eink', label: 'E-ink', width: 600 },
] as const;

type ViewportId = (typeof VIEWPORT_PRESETS)[number]['id'];

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
  const [viewport, setViewport] = useState<ViewportId>('default');

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

  const preset = VIEWPORT_PRESETS.find((p) => p.id === viewport)!;

  return (
    <section className="w-80 bg-slate-200 p-4 flex flex-col shrink-0 h-full">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600 shrink-0">
          실시간 미리보기
        </h2>
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        {VIEWPORT_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setViewport(p.id)}
            className={cn(
              'px-2 py-0.5 text-[10px] rounded-full border',
              viewport === p.id
                ? 'bg-slate-700 text-white border-slate-700'
                : 'bg-white text-slate-600 border-slate-300',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0 overflow-auto">
        <div
          className="relative bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl flex flex-col transition-all duration-200"
          style={{
            width: Math.min(preset.width + 16, 320),
            maxWidth: '100%',
            height: '100%',
            maxHeight: 560,
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-2xl z-10" />
          <div className="flex-1 bg-white rounded-[2rem] overflow-hidden mt-4 flex flex-col min-h-0">
            <div className="h-6 bg-slate-100 flex items-center justify-center shrink-0">
              <div className="w-16 h-1 bg-slate-300 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto bg-white">
              {!chapter ? (
                <p className="p-8 text-sm text-slate-400 text-center">
                  장을 선택하면 미리보기가 표시됩니다.
                </p>
              ) : (
                <div
                  key={`${chapter.id}-${readerThemeId}-${chapter.content.length}-${viewport}`}
                  className="epub-preview-root min-h-full"
                  style={{ maxWidth: preset.width }}
                >
                  <style>{scopedCss}</style>
                  <h1 className="chapter-title">{chapter.title}</h1>
                  <div
                    className="epub-preview-content"
                    dangerouslySetInnerHTML={{ __html: chapter.content }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-4">
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
