import Image from '@tiptap/extension-image';

export const EpubImage = Image.extend({
  name: 'image',

  addAttributes() {
    return {
      ...this.parent?.(),
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute('alt'),
        renderHTML: (attributes) => {
          if (!attributes.alt) return {};
          return { alt: attributes.alt };
        },
      },
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute('width'),
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      'data-align': {
        default: 'left',
        parseHTML: (element) => element.getAttribute('data-align') ?? 'left',
        renderHTML: (attributes) => ({
          'data-align': attributes['data-align'] ?? 'left',
        }),
      },
    };
  },
});
