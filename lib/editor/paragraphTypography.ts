import { Extension } from '@tiptap/core';

export const TYPOGRAPHY_CLASSES = {
  lineHeight: ['line-height-normal', 'line-height-relaxed', 'line-height-loose'],
  letterSpacing: ['letter-normal', 'letter-wide'],
  indent: ['indent-1', 'indent-2', 'outdent'],
} as const;

function mergeClass(existing: string | null | undefined, remove: string[], add: string): string {
  const parts = (existing ?? '')
    .split(/\s+/)
    .filter((c) => c && !remove.includes(c));
  if (add) parts.push(add);
  return parts.join(' ');
}

type CommandProps = {
  editor: {
    isActive: (type: string) => boolean;
    getAttributes: (type: string) => { class?: string | null };
  };
  commands: {
    updateAttributes: (type: string, attrs: { class: string | null }) => boolean;
  };
};

function makeTypoCommand(category: keyof typeof TYPOGRAPHY_CLASSES, value: string) {
  return () =>
    ({ editor, commands }: CommandProps) => {
      const type = editor.isActive('heading') ? 'heading' : 'paragraph';
      const currentClass = editor.getAttributes(type).class ?? undefined;
      const remove = [...TYPOGRAPHY_CLASSES[category]];
      const newClass = mergeClass(currentClass, remove, value);
      return commands.updateAttributes(type, { class: newClass || null });
    };
}

export const ParagraphTypography = Extension.create({
  name: 'paragraphTypography',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          class: {
            default: null,
            parseHTML: (element) => element.getAttribute('class'),
            renderHTML: (attributes) => {
              if (!attributes.class) return {};
              return { class: attributes.class };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeightNormal: makeTypoCommand('lineHeight', 'line-height-normal'),
      setLineHeightRelaxed: makeTypoCommand('lineHeight', 'line-height-relaxed'),
      setLineHeightLoose: makeTypoCommand('lineHeight', 'line-height-loose'),
      clearLineHeightClass: makeTypoCommand('lineHeight', ''),
      setLetterSpacingNormal: makeTypoCommand('letterSpacing', 'letter-normal'),
      setLetterSpacingWide: makeTypoCommand('letterSpacing', 'letter-wide'),
      clearLetterSpacingClass: makeTypoCommand('letterSpacing', ''),
      setIndent1: makeTypoCommand('indent', 'indent-1'),
      setIndent2: makeTypoCommand('indent', 'indent-2'),
      setOutdent: makeTypoCommand('indent', 'outdent'),
      clearIndentClass: makeTypoCommand('indent', ''),
    };
  },
});

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    paragraphTypography: {
      setLineHeightNormal: () => ReturnType;
      setLineHeightRelaxed: () => ReturnType;
      setLineHeightLoose: () => ReturnType;
      clearLineHeightClass: () => ReturnType;
      setLetterSpacingNormal: () => ReturnType;
      setLetterSpacingWide: () => ReturnType;
      clearLetterSpacingClass: () => ReturnType;
      setIndent1: () => ReturnType;
      setIndent2: () => ReturnType;
      setOutdent: () => ReturnType;
      clearIndentClass: () => ReturnType;
    };
  }
}
