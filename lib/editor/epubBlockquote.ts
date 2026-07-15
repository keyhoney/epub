import Blockquote from '@tiptap/extension-blockquote'

export const EpubBlockquote = Blockquote.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: { default: null, parseHTML: (el) => (el as HTMLElement).getAttribute('class'), renderHTML: (attrs) => { if (attrs.class) return { class: attrs.class }; return {} } },
      'data-variant': { default: null, parseHTML: (el) => (el as HTMLElement).getAttribute('data-variant'), renderHTML: (attrs) => { if (attrs['data-variant']) return { 'data-variant': attrs['data-variant'] }; return {} } },
    }
  },
})
