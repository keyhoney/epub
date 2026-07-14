'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { createEditorExtensions } from '@/lib/editor/editorExtensions';
import { EditorToolbar } from './EditorToolbar';
import { TableBubbleMenu } from './TableBubbleMenu';
import { ImageBubbleMenu } from './ImageBubbleMenu';
import { TextBubbleMenu } from './TextBubbleMenu';
import { FindReplaceModal } from './FindReplaceModal';
import { FootnoteInsertDialog } from './FootnoteInsertDialog';
import { SourceCodePanel } from './SourceCodePanel';
import { getTextStats } from '@/lib/editor/textStats';
import type { Chapter } from '@/lib/types/book';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

interface TiptapEditorProps {
  chapterId: string | null;
  content: string;
  chapters: Chapter[];
  onUpdate: (content: string) => void;
  onChapterContentReplace: (chapterId: string, content: string) => void;
  onImageSizeWarning?: (message: string) => void;
  onFocusTableStyle?: () => void;
}

export function TiptapEditor({
  chapterId,
  content,
  chapters,
  onUpdate,
  onChapterContentReplace,
  onImageSizeWarning,
  onFocusTableStyle,
}: TiptapEditorProps) {
  const isInternalUpdate = useRef(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showFootnote, setShowFootnote] = useState(false);
  const [showSource, setShowSource] = useState(false);

  const insertImageFile = useCallback(
    (file: File, ed: NonNullable<ReturnType<typeof useEditor>>) => {
      if (!ed) return;
      if (file.size > MAX_IMAGE_BYTES) {
        onImageSizeWarning?.('이미지는 10MB 이하여야 합니다.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        ed.chain().focus().setImage({ src: reader.result as string }).run();
      };
      reader.readAsDataURL(file);
    },
    [onImageSizeWarning],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: createEditorExtensions(),
    content,
    onUpdate: ({ editor: ed }) => {
      isInternalUpdate.current = true;
      onUpdate(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none min-h-[400px] px-6 py-4 focus:outline-none',
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files?.length || !editor) return false;
        const file = files[0];
        if (!file.type.startsWith('image/')) return false;
        event.preventDefault();
        insertImageFile(file, editor);
        return true;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items || !editor) return false;
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              event.preventDefault();
              insertImageFile(file, editor);
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        setShowFindReplace(true);
      }
    };
    const dom = editor.view.dom;
    dom.addEventListener('keydown', onKeyDown);
    return () => dom.removeEventListener('keydown', onKeyDown);
  }, [editor]);

  useEffect(() => {
    if (!editor || !chapterId) return;
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    if (editor.getHTML() !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [chapterId, content, editor]);

  if (!chapterId) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
        편집할 장을 선택하세요.
      </div>
    );
  }

  const html = editor?.getHTML() ?? content;
  const stats = getTextStats(html);

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0 relative">
      <EditorToolbar
        editor={editor}
        chapters={chapters}
        currentChapterId={chapterId}
        chapterContent={content}
        onImageSizeWarning={onImageSizeWarning}
        onShowFindReplace={() => setShowFindReplace(true)}
        onShowFootnote={() => setShowFootnote(true)}
        onShowSource={() => setShowSource(true)}
      />

      <div className="flex-1 overflow-y-auto relative">
        {editor && (
          <TextBubbleMenu
            editor={editor}
            advanced
            onOpenLink={() => {
              /* LinkPopover is on toolbar; focus link UX via prompt */
              const url = window.prompt('링크 URL');
              if (url === null) return;
              if (url === '') {
                editor.chain().focus().unsetLink().run();
              } else {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
          />
        )}
        {editor && (
          <TableBubbleMenu
            editor={editor}
            onFocusTableStyle={onFocusTableStyle}
          />
        )}
        {editor && <ImageBubbleMenu editor={editor} />}
        <EditorContent editor={editor} />
        {showSource && (
          <SourceCodePanel
            html={html}
            onApply={(newHtml) => {
              editor?.commands.setContent(newHtml);
              onUpdate(newHtml);
            }}
            onClose={() => setShowSource(false)}
            onError={(msg) => onImageSizeWarning?.(msg)}
          />
        )}
      </div>

      <div className="h-8 bg-slate-100 border-t border-slate-200 flex items-center justify-between px-4 text-[11px] text-slate-500 shrink-0">
        <span>
          {stats.charsWithSpaces.toLocaleString('ko-KR')}자 (공백 제외{' '}
          {stats.charsWithoutSpaces.toLocaleString('ko-KR')}자) ·{' '}
          {stats.words.toLocaleString('ko-KR')}단어 · {stats.readingTimeLabel}
        </span>
        <span>UTF-8 | EPUB 3.0</span>
      </div>

      {showFindReplace && editor && (
        <FindReplaceModal
          editor={editor}
          chapters={chapters}
          currentChapterId={chapterId}
          onReplaceChapter={(id, newContent) => {
            onChapterContentReplace(id, newContent);
            if (id === chapterId) {
              editor.commands.setContent(newContent, { emitUpdate: false });
            }
          }}
          onClose={() => setShowFindReplace(false)}
        />
      )}

      {showFootnote && editor && (
        <FootnoteInsertDialog
          editor={editor}
          chapterHtml={content}
          onClose={() => setShowFootnote(false)}
        />
      )}
    </div>
  );
}
