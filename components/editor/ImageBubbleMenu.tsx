'use client';

import { useCallback, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';

interface ImageBubbleMenuProps {
  editor: Editor;
}

const WIDTH_OPTIONS = [
  { label: '25%', value: '25%' },
  { label: '50%', value: '50%' },
  { label: '75%', value: '75%' },
  { label: '100%', value: '100%' },
];

export function ImageBubbleMenu({ editor }: ImageBubbleMenuProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState('');

  const shouldShow = useCallback(
    ({ editor: ed }: { editor: Editor }) => ed.isActive('image'),
    [],
  );

  const wrapWithFigure = () => {
    const attrs = editor.getAttributes('image');
    const src = attrs.src as string;
    if (!src) return;
    const alt = (attrs.alt as string) || '';
    const width = attrs.width ? ` width="${attrs.width}"` : '';
    const align = attrs['data-align']
      ? ` data-align="${attrs['data-align']}"`
      : '';
    const cap = caption.trim() || '캡션을 입력하세요';
    editor
      .chain()
      .focus()
      .deleteSelection()
      .insertContent(
        `<figure class="epub-figure"><img src="${src}" alt="${alt}"${width}${align} class="epub-image" /><figcaption>${cap}</figcaption></figure>`,
      )
      .run();
  };

  const replaceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor
        .chain()
        .focus()
        .updateAttributes('image', { src: reader.result as string })
        .run();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 w-60 z-30"
    >
      <label className="block text-xs text-slate-500 mb-1">대체 텍스트 (alt)</label>
      <input
        type="text"
        defaultValue={(editor.getAttributes('image').alt as string) ?? ''}
        onChange={(e) => {
          editor.chain().focus().updateAttributes('image', { alt: e.target.value }).run();
        }}
        className="w-full px-2 py-1 text-sm border border-slate-200 rounded mb-2"
        placeholder="이미지 설명"
      />
      <p className="text-xs text-slate-500 mb-1">너비</p>
      <div className="flex gap-1 mb-2">
        {WIDTH_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              editor.chain().focus().updateAttributes('image', { width: opt.value }).run()
            }
            className="flex-1 py-1 text-[10px] border border-slate-200 rounded hover:bg-slate-50"
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 mb-1">정렬</p>
      <div className="flex gap-1 mb-2">
        {(['left', 'center', 'right'] as const).map((align) => (
          <button
            key={align}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              editor.chain().focus().updateAttributes('image', { 'data-align': align }).run()
            }
            className="flex-1 py-1 text-[10px] border border-slate-200 rounded hover:bg-slate-50 capitalize"
          >
            {align === 'left' ? '왼쪽' : align === 'center' ? '가운데' : '오른쪽'}
          </button>
        ))}
      </div>
      <label className="block text-xs text-slate-500 mb-1">캡션 추가</label>
      <div className="flex gap-1 mb-2">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-slate-200 rounded"
          placeholder="캡션"
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={wrapWithFigure}
          className="px-2 py-1 text-[10px] bg-slate-100 rounded hover:bg-slate-200"
        >
          적용
        </button>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="flex-1 py-1.5 text-xs border border-slate-200 rounded hover:bg-slate-50"
        >
          교체
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().deleteSelection().run()}
          className="flex-1 py-1.5 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50"
        >
          삭제
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={replaceImage}
      />
    </BubbleMenu>
  );
}
