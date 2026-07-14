import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import CharacterCount from '@tiptap/extension-character-count';
import { Dropcursor } from '@tiptap/extensions';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import type { Extensions } from '@tiptap/react';
import { ParagraphTypography } from './paragraphTypography';
import { TextAppearance } from './textAppearance';
import { EpubImage } from './epubImage';

const lowlight = createLowlight(common);

export function createEditorExtensions(): Extensions {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3, 4] },
      link: false,
      underline: false,
      dropcursor: false,
      codeBlock: false,
    }),
    CodeBlockLowlight.configure({ lowlight }),
    Dropcursor,
    Underline,
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    ParagraphTypography,
    TextAppearance,
    EpubImage.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: { class: 'epub-image' },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph', 'tableCell', 'tableHeader'],
      alignments: ['left', 'center', 'right', 'justify'],
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { rel: 'noopener noreferrer' },
    }),
    Placeholder.configure({ placeholder: '본문을 입력하세요...' }),
    Table.configure({
      resizable: true,
      HTMLAttributes: { class: 'epub-table' },
    }),
    TableRow,
    TableHeader,
    TableCell,
    CharacterCount,
  ];
}

export const TEXT_COLOR_PRESETS = [
  { label: '기본', value: '' },
  { label: '검정', value: '#111827' },
  { label: '회색', value: '#6b7280' },
  { label: '빨강', value: '#dc2626' },
  { label: '주황', value: '#ea580c' },
  { label: '초록', value: '#16a34a' },
  { label: '파랑', value: '#2563eb' },
  { label: '보라', value: '#7c3aed' },
] as const;

export const HIGHLIGHT_PRESETS = [
  { label: '없음', value: '' },
  { label: '노랑', value: '#fef08a' },
  { label: '초록', value: '#bbf7d0' },
  { label: '파랑', value: '#bfdbfe' },
  { label: '분홍', value: '#fbcfe8' },
] as const;

export function insertImageFromFile(
  editor: { chain: () => { focus: () => { setImage: (attrs: { src: string }) => { run: () => void } } } },
  dataUrl: string,
) {
  editor.chain().focus().setImage({ src: dataUrl }).run();
}
