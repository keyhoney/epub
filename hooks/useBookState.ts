'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type BookMetadata,
  type BookState,
  type Chapter,
  type ReaderThemeId,
  type ThemeComponents,
  createDefaultBookState,
} from '@/lib/types/book';
import {
  clearBookState,
  loadBookState,
  saveBookState,
} from '@/lib/storage/bookStorage';
import {
  downloadProjectFile,
  readProjectFile,
} from '@/lib/storage/projectFile';
import {
  createBookFromTemplate,
  type BookTemplateId,
} from '@/lib/templates/bookTemplates';

const AUTO_SAVE_DELAY_MS = 800;

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function stripForbiddenTags(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
}

function reorderChapters(chapters: Chapter[]): Chapter[] {
  return [...chapters]
    .sort((a, b) => a.order - b.order)
    .map((chapter, index) => ({ ...chapter, order: index }));
}

function formatSavedTime(date = new Date()): string {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function useBookState() {
  const [bookState, setBookState] = useState<BookState>(createDefaultBookState);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null,
  );
  const [lastSavedTime, setLastSavedTime] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyBookState = useCallback((state: BookState) => {
    const normalized = {
      ...state,
      chapters: reorderChapters(state.chapters),
    };
    setBookState(normalized);
    setSelectedChapterId((current) => {
      if (current && normalized.chapters.some((c) => c.id === current)) {
        return current;
      }
      return normalized.chapters[0]?.id ?? null;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const loaded = await loadBookState();
      if (cancelled) return;
      applyBookState(loaded);
      setLastSavedTime(formatSavedTime());
      setSaveStatus('saved');
      setIsLoaded(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [applyBookState]);

  useEffect(() => {
    if (!isLoaded) return;

    setSaveStatus('saving');
    setSaveError(null);

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      void (async () => {
        try {
          await saveBookState(bookState);
          setLastSavedTime(formatSavedTime());
          setSaveStatus('saved');
          setSaveError(null);
        } catch (err) {
          setSaveStatus('error');
          setSaveError(
            err instanceof Error ? err.message : '자동 저장에 실패했습니다.',
          );
        }
      })();
    }, AUTO_SAVE_DELAY_MS);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [bookState, isLoaded]);

  const updateMetadata = useCallback((updates: Partial<BookMetadata>) => {
    setBookState((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, ...updates },
    }));
  }, []);

  const setReaderThemeId = useCallback((readerThemeId: ReaderThemeId) => {
    setBookState((prev) => ({ ...prev, readerThemeId }));
  }, []);

  const setThemeComponents = useCallback((themeComponents: ThemeComponents) => {
    setBookState((prev) => ({ ...prev, themeComponents }));
  }, []);

  const updateThemeComponent = useCallback(
    (key: keyof ThemeComponents, styleId: string | undefined) => {
      setBookState((prev) => {
        const next = { ...(prev.themeComponents ?? {}) };
        if (!styleId) {
          delete next[key];
        } else {
          next[key] = styleId;
        }
        return { ...prev, themeComponents: next };
      });
    },
    [],
  );

  const applyTemplate = useCallback(
    async (templateId: BookTemplateId) => {
      const next = createBookFromTemplate(templateId);
      applyBookState(next);
      await clearBookState();
      await saveBookState(next);
      setLastSavedTime(formatSavedTime());
      setSaveStatus('saved');
      setSaveError(null);
    },
    [applyBookState],
  );

  const addChapter = useCallback(() => {
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: `제${0}장`,
      content: '<p>새로운 내용을 여기에 작성하세요.</p>',
      order: 0,
    };

    setBookState((prev) => {
      const chapters = reorderChapters([...prev.chapters, newChapter]);
      const added = chapters.find((c) => c.id === newChapter.id)!;
      const chapterNumber = chapters.length;
      return {
        ...prev,
        chapters: chapters.map((c) =>
          c.id === added.id
            ? { ...c, title: `제${chapterNumber}장`, order: chapterNumber - 1 }
            : c,
        ),
      };
    });

    setSelectedChapterId(newChapter.id);
    return newChapter.id;
  }, []);

  const deleteChapter = useCallback((id: string) => {
    setBookState((prev) => {
      if (prev.chapters.length <= 1) return prev;
      const chapters = reorderChapters(
        prev.chapters.filter((c) => c.id !== id),
      );
      setSelectedChapterId((current) =>
        current === id ? (chapters[0]?.id ?? null) : current,
      );
      return { ...prev, chapters };
    });
  }, []);

  const updateChapterTitle = useCallback((id: string, title: string) => {
    setBookState((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === id ? { ...c, title } : c,
      ),
    }));
  }, []);

  const updateChapterContent = useCallback((id: string, content: string) => {
    const sanitized = stripForbiddenTags(content);
    setBookState((prev) => ({
      ...prev,
      chapters: prev.chapters.map((c) =>
        c.id === id ? { ...c, content: sanitized } : c,
      ),
    }));
  }, []);

  const reorderChaptersList = useCallback((orderedIds: string[]) => {
    setBookState((prev) => {
      const chapterMap = new Map(prev.chapters.map((c) => [c.id, c]));
      const chapters = orderedIds
        .map((id, index) => {
          const chapter = chapterMap.get(id);
          return chapter ? { ...chapter, order: index } : null;
        })
        .filter((c): c is Chapter => c !== null);
      return { ...prev, chapters };
    });
  }, []);

  const resetBook = useCallback(async () => {
    const defaults = createDefaultBookState();
    applyBookState(defaults);
    await clearBookState();
    await saveBookState(defaults);
    setLastSavedTime(formatSavedTime());
    setSaveStatus('saved');
    setSaveError(null);
  }, [applyBookState]);

  const saveProjectToFile = useCallback(() => {
    downloadProjectFile(bookState);
  }, [bookState]);

  const loadProjectFromFile = useCallback(
    async (file: File) => {
      const loaded = await readProjectFile(file);
      applyBookState(loaded);
      await saveBookState(loaded);
      setLastSavedTime(formatSavedTime());
      setSaveStatus('saved');
      setSaveError(null);
      return loaded;
    },
    [applyBookState],
  );

  const selectedChapter =
    bookState.chapters.find((c) => c.id === selectedChapterId) ??
    bookState.chapters[0] ??
    null;

  const sortedChapters = [...bookState.chapters].sort(
    (a, b) => a.order - b.order,
  );

  return {
    bookState,
    sortedChapters,
    selectedChapter,
    selectedChapterId: selectedChapter?.id ?? null,
    setSelectedChapterId,
    lastSavedTime,
    saveStatus,
    saveError,
    isLoaded,
    updateMetadata,
    setReaderThemeId,
    setThemeComponents,
    updateThemeComponent,
    applyTemplate,
    addChapter,
    deleteChapter,
    updateChapterTitle,
    updateChapterContent,
    reorderChaptersList,
    resetBook,
    saveProjectToFile,
    loadProjectFromFile,
  };
}
