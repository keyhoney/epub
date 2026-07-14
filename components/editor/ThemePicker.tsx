'use client';

import { useMemo, useState } from 'react';
import type { ReaderThemeId } from '@/lib/types/book';
import {
  THEME_CATEGORIES,
  getThemesByCategory,
  type ThemeCategory,
} from '@/lib/epub/themes';
import { cn } from '@/lib/utils';

interface ThemePickerProps {
  selectedThemeId: ReaderThemeId;
  onSelect: (themeId: ReaderThemeId) => void;
}

export function ThemePicker({ selectedThemeId, onSelect }: ThemePickerProps) {
  const [category, setCategory] = useState<ThemeCategory>('all');

  const filteredThemes = useMemo(
    () => getThemesByCategory(category),
    [category],
  );

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        읽기 테마
      </h3>

      <div className="flex flex-wrap gap-1">
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

      <div className="max-h-48 overflow-y-auto pr-1">
        <div className="grid grid-cols-3 gap-1.5">
          {filteredThemes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelect(theme.id)}
              title={theme.name}
              className={cn(
                'flex flex-col items-center gap-1 p-1.5 border rounded cursor-pointer transition-all hover:border-slate-400 bg-white',
                selectedThemeId === theme.id &&
                  'ring-2 ring-blue-500 ring-offset-1 border-blue-300',
              )}
            >
              <div className="flex w-full h-4 rounded overflow-hidden border border-black/10">
                <span
                  className="flex-1"
                  style={{ backgroundColor: theme.preview.bg }}
                />
                <span
                  className="flex-1"
                  style={{ backgroundColor: theme.preview.text }}
                />
                <span
                  className="flex-1"
                  style={{ backgroundColor: theme.preview.accent }}
                />
              </div>
              <span
                className="text-[9px] leading-tight text-center text-slate-700 font-medium line-clamp-2 w-full"
              >
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
