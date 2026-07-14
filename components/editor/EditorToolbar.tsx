'use client';

import { useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Code2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Minus,
  ChevronDown,
  Undo2,
  Redo2,
  Eraser,
  HelpCircle,
  Table as TableIcon,
  Palette,
  Highlighter,
  FileCode,
  Search,
  BookMarked,
  SeparatorHorizontal,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  TEXT_COLOR_PRESETS,
  HIGHLIGHT_PRESETS,
} from '@/lib/editor/editorExtensions';
import {
  FONT_FAMILY_OPTIONS,
  TEXT_SIZE_OPTIONS,
} from '@/lib/editor/textAppearance';
import { LinkPopover } from './LinkPopover';
import { ShortcutHelpModal } from './ShortcutHelpModal';
import { TableInsertPopover } from './TableInsertPopover';
import { HeadingDropdown } from './HeadingDropdown';
import { TypographyDropdown } from './TypographyDropdown';
import { SpecialCharPopover } from './SpecialCharPopover';
import { BlockGalleryPopover } from './BlockGalleryPopover';
import { useEditorState } from '@/hooks/useEditorState';
import type { Chapter } from '@/lib/types/book';

const TOOLBAR_MODE_KEY = 'epub_studio_toolbar_mode';

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={cn(
        'p-1.5 rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
        active
          ? 'bg-blue-100 text-blue-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-slate-300 mx-1 shrink-0" />;
}

interface EditorToolbarProps {
  editor: Editor | null;
  chapters: Chapter[];
  currentChapterId: string | null;
  chapterContent: string;
  onImageSizeWarning?: (message: string) => void;
  onShowFindReplace?: () => void;
  onShowFootnote?: () => void;
  onShowSource?: () => void;
}

export function EditorToolbar({
  editor,
  chapters,
  currentChapterId,
  onImageSizeWarning,
  onShowFindReplace,
  onShowFootnote,
  onShowSource,
}: EditorToolbarProps) {
  useEditorState(editor);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<
    'color' | 'highlight' | 'table' | 'font' | 'size' | null
  >(null);

  useEffect(() => {
    const saved = localStorage.getItem(TOOLBAR_MODE_KEY);
    if (saved === 'advanced') setAdvanced(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(TOOLBAR_MODE_KEY, advanced ? 'advanced' : 'basic');
  }, [advanced]);

  useEffect(() => {
    if (!editor) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setShowLinkPopover(true);
        setOpenDropdown(null);
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        onShowFindReplace?.();
      }
    };

    const dom = editor.view.dom;
    dom.addEventListener('keydown', onKeyDown);
    return () => dom.removeEventListener('keydown', onKeyDown);
  }, [editor, onShowFindReplace]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    if (file.size > 10 * 1024 * 1024) {
      onImageSizeWarning?.('이미지는 10MB 이하여야 합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const clearFormatting = () => {
    if (!editor) return;
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  };

  const closeDropdowns = () => setOpenDropdown(null);

  if (!editor) return null;

  const textClass = (editor.getAttributes('textStyle').class as string) ?? '';

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-1.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="실행 취소 (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="다시 실행 (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="굵게 (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="기울임 (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="밑줄 (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>

          {advanced && (
            <>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                active={editor.isActive('strike')}
                title="취소선"
              >
                <Strikethrough className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                active={editor.isActive('code')}
                title="인라인 코드"
              >
                <Code className="w-4 h-4" />
              </ToolbarButton>
            </>
          )}

          <ToolbarDivider />

          <HeadingDropdown editor={editor} />

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdown((d) => (d === 'font' ? null : 'font'))
              }
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded"
              title="글꼴"
            >
              글꼴
              <ChevronDown className="w-3 h-3" />
            </button>
            {openDropdown === 'font' && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                {FONT_FAMILY_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      editor
                        .chain()
                        .focus()
                        .setFontFamilyClass(opt.id)
                        .run();
                      closeDropdowns();
                    }}
                    className={cn(
                      'w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50',
                      opt.className,
                      opt.id && textClass.includes(opt.id) && 'bg-blue-50',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdown((d) => (d === 'size' ? null : 'size'))
              }
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded"
              title="글자 크기"
            >
              크기
              <ChevronDown className="w-3 h-3" />
            </button>
            {openDropdown === 'size' && (
              <div className="absolute top-full left-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                {TEXT_SIZE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      editor
                        .chain()
                        .focus()
                        .setTextSizeClass(
                          opt.id === 'text-size-md' ? null : opt.id,
                        )
                        .run();
                      closeDropdowns();
                    }}
                    className={cn(
                      'w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50',
                      textClass.includes(opt.id) && 'bg-blue-50',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {advanced && <TypographyDropdown editor={editor} />}

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="글머리 목록"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="번호 목록"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          {advanced && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive('codeBlock')}
              title="코드 블록"
            >
              <Code2 className="w-4 h-4" />
            </ToolbarButton>
          )}

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="왼쪽 정렬"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="가운데 정렬"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="오른쪽 정렬"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            active={editor.isActive({ textAlign: 'justify' })}
            title="양쪽 정렬"
          >
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <button
            type="button"
            onClick={() => setAdvanced((v) => !v)}
            className={cn(
              'flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded border',
              advanced
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
            )}
            title="고급 도구 표시"
            aria-pressed={advanced}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {advanced ? '고급' : '고급'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-0.5 px-3 py-1.5 border-t border-slate-100">
          <div className="relative">
            <ToolbarButton
              onClick={() => {
                setShowLinkPopover((v) => !v);
                closeDropdowns();
              }}
              active={editor.isActive('link') || showLinkPopover}
              title="링크 (Ctrl+K)"
            >
              <LinkIcon className="w-4 h-4" />
            </ToolbarButton>
            {showLinkPopover && (
              <LinkPopover
                editor={editor}
                chapters={chapters}
                currentChapterId={currentChapterId}
                onClose={() => setShowLinkPopover(false)}
              />
            )}
          </div>

          <ToolbarButton
            onClick={() => imageInputRef.current?.click()}
            title="이미지 삽입"
          >
            <ImageIcon className="w-4 h-4" />
          </ToolbarButton>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="인용구"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>

          {advanced && (
            <>
              <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="구분선"
              >
                <Minus className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertContent('<hr class="page-break" />')
                    .run()
                }
                title="페이지 나눔"
              >
                <SeparatorHorizontal className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => onShowFootnote?.()} title="각주 삽입">
                <BookMarked className="w-4 h-4" />
              </ToolbarButton>
              <SpecialCharPopover editor={editor} />
            </>
          )}

          <ToolbarDivider />

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdown((d) => (d === 'table' ? null : 'table'))
              }
              className={cn(
                'flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded cursor-pointer',
                openDropdown === 'table' || editor.isActive('table')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100',
              )}
              title="표 삽입·편집"
            >
              <TableIcon className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </button>
            {openDropdown === 'table' && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
                <TableInsertPopover
                  editor={editor}
                  onClose={closeDropdowns}
                />
              </div>
            )}
          </div>

          <ToolbarDivider />

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdown((d) => (d === 'color' ? null : 'color'))
              }
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
              title="글자색"
            >
              <Palette className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </button>
            {openDropdown === 'color' && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-slate-200 rounded-lg shadow-lg z-20 grid grid-cols-4 gap-1 w-36">
                {TEXT_COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    title={preset.label}
                    onClick={() => {
                      if (!preset.value) {
                        editor.chain().focus().unsetColor().run();
                      } else {
                        editor.chain().focus().setColor(preset.value).run();
                      }
                      closeDropdowns();
                    }}
                    className="w-7 h-7 rounded border border-slate-200 hover:scale-110 transition-transform"
                    style={{ backgroundColor: preset.value || '#ffffff' }}
                  />
                ))}
              </div>
            )}
          </div>

          {advanced && (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown((d) =>
                    d === 'highlight' ? null : 'highlight',
                  )
                }
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                title="형광펜"
              >
                <Highlighter className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </button>
              {openDropdown === 'highlight' && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-slate-200 rounded-lg shadow-lg z-20 flex gap-1">
                  {HIGHLIGHT_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      title={preset.label}
                      onClick={() => {
                        if (!preset.value) {
                          editor.chain().focus().unsetHighlight().run();
                        } else {
                          editor
                            .chain()
                            .focus()
                            .setHighlight({ color: preset.value })
                            .run();
                        }
                        closeDropdowns();
                      }}
                      className="w-7 h-7 rounded border border-slate-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: preset.value || '#ffffff' }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <ToolbarDivider />

          <BlockGalleryPopover
            editor={editor}
            onImageSizeWarning={onImageSizeWarning}
          />

          {advanced && (
            <>
              <ToolbarDivider />
              <ToolbarButton
                onClick={() => onShowFindReplace?.()}
                title="찾기 및 바꾸기 (Ctrl+F)"
              >
                <Search className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => onShowSource?.()} title="HTML 소스">
                <FileCode className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarDivider />
              <ToolbarButton onClick={clearFormatting} title="서식 지우기">
                <Eraser className="w-4 h-4" />
              </ToolbarButton>
            </>
          )}

          <ToolbarButton
            onClick={() => setShowShortcuts(true)}
            title="단축키 안내"
          >
            <HelpCircle className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {showShortcuts && (
        <ShortcutHelpModal onClose={() => setShowShortcuts(false)} />
      )}
    </>
  );
}

export { TOOLBAR_MODE_KEY };
