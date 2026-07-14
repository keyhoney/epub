'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReaderThemeId, ThemeComponentKey, ThemeComponents } from '@/lib/types/book';
import {
  THEME_CATEGORIES,
  getThemesByCategory,
  type ThemeCategory,
} from '@/lib/epub/themes';
import {
  COMPONENT_CATALOGS,
  type CatalogComponentKey,
} from '@/lib/epub/styleCatalog';
import { getResolvedThemeCss } from '@/lib/epub/resolveThemeTokens';
import { cn } from '@/lib/utils';

const COMPONENT_TABS: { key: ThemeComponentKey; label: string }[] = [
  { key: 'table', label: '표' },
  { key: 'infoBox', label: '정보 박스' },
  { key: 'quote', label: '인용' },
  { key: 'dropCap', label: '첫글자' },
  { key: 'hr', label: '구분선' },
  { key: 'figure', label: '그림' },
];

const MINI_PREVIEW_HTML = `
<h1 class="chapter-title">미리보기</h1>
<p class="drop-cap"><span class="first-letter">가</span>테마 세부 스타일이 여기에 반영됩니다.</p>
<aside class="info-box" data-variant="tip"><h2>팁</h2><p>정보 박스 스타일 샘플입니다.</p></aside>
<blockquote class="epub-quote"><p>인용구 샘플입니다.</p><cite>— 출처</cite></blockquote>
<table class="epub-table"><thead><tr><th>항목</th><th>값</th></tr></thead><tbody><tr><td>하나</td><td>1</td></tr><tr><td>둘</td><td>2</td></tr></tbody></table>
<hr />
<figure class="epub-figure"><div style="height:48px;background:#ddd;border-radius:4px;"></div><figcaption>그림 캡션</figcaption></figure>
`;

interface ThemeStudioProps {
  selectedThemeId: ReaderThemeId;
  themeComponents?: ThemeComponents;
  focusKey?: string | null;
  onSelectTheme: (themeId: ReaderThemeId) => void;
  onComponentChange: (
    key: keyof ThemeComponents,
    styleId: string | undefined,
  ) => void;
}

function scopeCss(css: string): string {
  return css.replace(/\bbody\b/g, '.theme-mini-root');
}

export function ThemeStudio({
  selectedThemeId,
  themeComponents,
  focusKey,
  onSelectTheme,
  onComponentChange,
}: ThemeStudioProps) {
  const [category, setCategory] = useState<ThemeCategory>('all');
  const [activeTab, setActiveTab] = useState<ThemeComponentKey>('table');
  const [keepDetails, setKeepDetails] = useState(true);

  useEffect(() => {
    if (focusKey && COMPONENT_TABS.some((t) => t.key === focusKey)) {
      setActiveTab(focusKey as ThemeComponentKey);
    }
  }, [focusKey]);

  const filteredThemes = useMemo(
    () => getThemesByCategory(category),
    [category],
  );

  const catalog = COMPONENT_CATALOGS[activeTab as CatalogComponentKey];
  const selectedComponentId = themeComponents?.[activeTab];

  const miniCss = useMemo(
    () =>
      scopeCss(
        getResolvedThemeCss({
          readerThemeId: selectedThemeId,
          themeComponents,
        }),
      ),
    [selectedThemeId, themeComponents],
  );

  const summaryChips = useMemo(() => {
    return COMPONENT_TABS.map((tab) => {
      const id = themeComponents?.[tab.key];
      if (!id) return null;
      const entry = COMPONENT_CATALOGS[tab.key as CatalogComponentKey].find(
        (e) => e.id === id,
      );
      return entry ? `${tab.label}: ${entry.label}` : null;
    }).filter(Boolean) as string[];
  }, [themeComponents]);

  const handleSelectTheme = (id: ReaderThemeId) => {
    onSelectTheme(id);
    if (!keepDetails) {
      COMPONENT_TABS.forEach((tab) => onComponentChange(tab.key, undefined));
    }
  };

  return (
    <div className="space-y-3" id="theme-studio">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        읽기 테마
      </h3>

      <div>
        <p className="text-[11px] font-medium text-slate-600 mb-1.5">분위기</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {THEME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors',
                category === cat.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={keepDetails}
            onChange={(e) => setKeepDetails(e.target.checked)}
            className="rounded border-slate-300"
          />
          분위기 바꿔도 세부 스타일 유지
        </label>
        <div className="max-h-40 overflow-y-auto pr-1">
          <div className="grid grid-cols-3 gap-1.5">
            {filteredThemes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleSelectTheme(theme.id)}
                title={theme.name}
                aria-pressed={selectedThemeId === theme.id}
                className={cn(
                  'flex flex-col items-center gap-1 p-1.5 border rounded cursor-pointer transition-all hover:border-slate-400 bg-white',
                  selectedThemeId === theme.id &&
                    'ring-2 ring-blue-500 ring-offset-1 border-blue-300',
                )}
              >
                <div className="flex w-full h-4 rounded overflow-hidden border border-black/10">
                  <span className="flex-1" style={{ backgroundColor: theme.preview.bg }} />
                  <span className="flex-1" style={{ backgroundColor: theme.preview.text }} />
                  <span className="flex-1" style={{ backgroundColor: theme.preview.accent }} />
                </div>
                <span className="text-[9px] leading-tight text-center text-slate-700 font-medium line-clamp-2 w-full">
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[11px] font-medium text-slate-600">세부 스타일</p>
          <button
            type="button"
            onClick={() => onComponentChange(activeTab, undefined)}
            className="text-[10px] text-blue-600 hover:underline"
          >
            분위기 기본값
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {COMPONENT_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] border',
                activeTab === tab.key
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-200',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
          {catalog.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onComponentChange(activeTab, entry.id)}
              aria-pressed={selectedComponentId === entry.id}
              className={cn(
                'text-left p-1.5 rounded border bg-white hover:border-slate-400',
                selectedComponentId === entry.id &&
                  'ring-2 ring-blue-500 border-blue-300',
              )}
            >
              <div className="flex h-2.5 rounded overflow-hidden mb-1 border border-black/5">
                <span className="flex-1" style={{ backgroundColor: entry.preview.a }} />
                <span className="flex-1" style={{ backgroundColor: entry.preview.b }} />
                <span className="flex-1" style={{ backgroundColor: entry.preview.c }} />
              </div>
              <span className="block text-[10px] font-medium text-slate-800">
                {entry.label}
              </span>
              {entry.description && (
                <span className="block text-[9px] text-slate-400 leading-tight mt-0.5">
                  {entry.description}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {summaryChips.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {summaryChips.map((chip) => (
            <span
              key={chip}
              className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
        <p className="text-[10px] px-2 py-1 bg-slate-50 text-slate-500 border-b border-slate-100">
          스타일 미리보기
        </p>
        <div
          className="theme-mini-root max-h-40 overflow-y-auto text-[10px] leading-snug p-2"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `<style>${miniCss}</style>${MINI_PREVIEW_HTML}`,
          }}
        />
      </div>
    </div>
  );
}
