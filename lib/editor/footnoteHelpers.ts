import type { Editor } from '@tiptap/react';

export function countFootnotesInHtml(html: string): number {
  const matches = html.match(/epub:type="footnote"|class="footnote"/g);
  return matches?.length ?? 0;
}

export function buildFootnoteHtml(
  footnoteNumber: number,
  body: string,
): { refHtml: string; asideHtml: string } {
  const id = `fn-${footnoteNumber}`;
  const escapedBody = body.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return {
    refHtml: `<a epub:type="noteref" href="#${id}">${footnoteNumber}</a>`,
    asideHtml: `<aside class="footnote" epub:type="footnote" id="${id}"><p>${escapedBody}</p></aside>`,
  };
}

export function insertFootnote(editor: Editor, body: string, existingHtml: string) {
  const num = countFootnotesInHtml(existingHtml) + 1;
  const { refHtml, asideHtml } = buildFootnoteHtml(num, body);
  editor.chain().focus().insertContent(refHtml).run();
  editor.chain().focus('end').insertContent(asideHtml).run();
}
