'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Pencil, Trash2 } from 'lucide-react';
import type {
  BookMetadata,
  Chapter,
  ReaderThemeId,
  ThemeComponents,
} from '@/lib/types/book';
import { BookMetadataForm } from './BookMetadataForm';
import { ThemeStudio } from './ThemeStudio';
import { cn } from '@/lib/utils';

interface ChapterSidebarProps {
  metadata: BookMetadata;
  chapters: Chapter[];
  selectedChapterId: string | null;
  readerThemeId: ReaderThemeId;
  themeComponents?: ThemeComponents;
  themeFocusKey?: string | null;
  onMetadataChange: (updates: Partial<BookMetadata>) => void;
  onThemeChange: (themeId: ReaderThemeId) => void;
  onThemeComponentChange: (
    key: keyof ThemeComponents,
    styleId: string | undefined,
  ) => void;
  onSelectChapter: (id: string) => void;
  onAddChapter: () => void;
  onDeleteChapter: (id: string) => void;
  onUpdateChapterTitle: (id: string, title: string) => void;
  onReorderChapters: (orderedIds: string[]) => void;
}

function SortableChapterItem({
  chapter,
  isSelected,
  canDelete,
  onSelect,
  onDelete,
  onUpdateTitle,
}: {
  chapter: Chapter;
  isSelected: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpdateTitle: (title: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer transition-colors',
        isSelected
          ? 'bg-blue-100 text-blue-700 font-medium'
          : 'text-slate-600 hover:bg-slate-100',
        isDragging && 'opacity-60 shadow-md z-10',
      )}
      onClick={onSelect}
    >
      <button
        type="button"
        className="p-0.5 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
        aria-label="장 순서 변경"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>
      <input
        type="text"
        value={chapter.title}
        onChange={(e) => onUpdateTitle(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="장 제목"
        className="flex-1 min-w-0 text-sm bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-300 rounded px-1"
      />
      <button
        type="button"
        aria-label={`${chapter.title} 장 편집`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      {canDelete && (
        <button
          type="button"
          aria-label={`${chapter.title} 장 삭제`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export function ChapterSidebar({
  metadata,
  chapters,
  selectedChapterId,
  readerThemeId,
  themeComponents,
  themeFocusKey,
  onMetadataChange,
  onThemeChange,
  onThemeComponentChange,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  onUpdateChapterTitle,
  onReorderChapters,
}: ChapterSidebarProps) {
  const sorted = [...chapters].sort((a, b) => a.order - b.order);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = sorted.map((c) => c.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...ids];
    const [removed] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, removed);
    onReorderChapters(reordered);
  };

  const handleDelete = (chapter: Chapter) => {
    if (
      !window.confirm(
        `「${chapter.title || '제목 없음'}」장을 삭제할까요?`,
      )
    ) {
      return;
    }
    onDeleteChapter(chapter.id);
  };

  return (
    <section className="w-72 border-r border-slate-200 bg-white flex flex-col shrink-0 h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-slate-100">
          <BookMetadataForm
            metadata={metadata}
            onMetadataChange={onMetadataChange}
          />
        </div>

        <div className="p-4 border-b border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              장 목록
            </h2>
            <button
              type="button"
              onClick={onAddChapter}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              추가
            </button>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sorted.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                {sorted.map((chapter) => (
                  <SortableChapterItem
                    key={chapter.id}
                    chapter={chapter}
                    isSelected={selectedChapterId === chapter.id}
                    canDelete={chapters.length > 1}
                    onSelect={() => onSelectChapter(chapter.id)}
                    onDelete={() => handleDelete(chapter)}
                    onUpdateTitle={(title) =>
                      onUpdateChapterTitle(chapter.id, title)
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="p-4">
          <ThemeStudio
            selectedThemeId={readerThemeId}
            themeComponents={themeComponents}
            focusKey={themeFocusKey}
            onSelectTheme={onThemeChange}
            onComponentChange={onThemeComponentChange}
          />
        </div>
      </div>
    </section>
  );
}
