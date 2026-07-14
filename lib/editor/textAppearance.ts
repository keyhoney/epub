import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textAppearance: {
      setTextSizeClass: (sizeClass: string | null) => ReturnType;
      setFontFamilyClass: (fontClass: string | null) => ReturnType;
    };
  }
}

const SIZE_CLASSES = [
  'text-size-sm',
  'text-size-md',
  'text-size-lg',
  'text-size-xl',
] as const;

const FONT_CLASSES = [
  'font-serif',
  'font-sans',
  'font-mono',
  'font-gothic',
  'font-myeongjo',
  'font-nanum',
] as const;

function replaceClass(
  existing: string | undefined,
  remove: readonly string[],
  add: string | null,
): string | null {
  const parts = (existing ?? '').split(/\s+/).filter(Boolean);
  const filtered = parts.filter((c) => !remove.includes(c as never));
  if (add) filtered.push(add);
  return filtered.length ? filtered.join(' ') : null;
}

export const TextAppearance = Extension.create({
  name: 'textAppearance',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          class: {
            default: null,
            parseHTML: (element) => element.getAttribute('class'),
            renderHTML: (attributes) => {
              if (!attributes.class) return {};
              return { class: attributes.class as string };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTextSizeClass:
        (sizeClass) =>
        ({ editor, chain }) => {
          const attrs = { ...editor.getAttributes('textStyle') };
          const next = replaceClass(
            attrs.class as string | undefined,
            SIZE_CLASSES,
            sizeClass,
          );
          return chain()
            .focus()
            .setMark('textStyle', { ...attrs, class: next })
            .run();
        },
      setFontFamilyClass:
        (fontClass) =>
        ({ editor, chain }) => {
          const attrs = { ...editor.getAttributes('textStyle') };
          const next = replaceClass(
            attrs.class as string | undefined,
            FONT_CLASSES,
            fontClass,
          );
          return chain()
            .focus()
            .setMark('textStyle', { ...attrs, class: next })
            .run();
        },
    };
  },
});

export const TEXT_SIZE_OPTIONS = [
  { id: 'text-size-sm', label: '작음' },
  { id: 'text-size-md', label: '보통' },
  { id: 'text-size-lg', label: '큼' },
  { id: 'text-size-xl', label: '더큼' },
] as const;

export const FONT_FAMILY_OPTIONS = [
  { id: null, label: '본문 기본', className: '' },
  { id: 'font-myeongjo', label: '명조', className: 'font-myeongjo' },
  { id: 'font-gothic', label: '고딕', className: 'font-gothic' },
  { id: 'font-nanum', label: '나눔', className: 'font-nanum' },
  { id: 'font-serif', label: '세리프', className: 'font-serif' },
  { id: 'font-sans', label: '산세리프', className: 'font-sans' },
  { id: 'font-mono', label: '고정폭', className: 'font-mono' },
] as const;
