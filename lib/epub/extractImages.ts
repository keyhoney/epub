import { getExtensionFromMimeSub, getMimeType } from './mimeTypes';

export interface ExtractedImage {
  id: string;
  path: string;
  href: string;
  mediaType: string;
  data: Uint8Array;
}

export interface ImageExtractionResult {
  html: string;
  images: ExtractedImage[];
}

const DATA_URL_REGEX =
  /src=["'](data:image\/(jpeg|jpg|png|gif|webp|avif|bmp|svg\+xml|tiff|heic|heif|apng);base64,([^"']+))["']/gi;

function decodeDataUrl(
  mimeSub: string,
  base64: string,
  index: number,
): ExtractedImage | null {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const ext = getExtensionFromMimeSub(mimeSub);
    const mediaType = getMimeType(ext);
    const filename = `img-${String(index).padStart(3, '0')}.${ext}`;
    const path = `OEBPS/images/${filename}`;
    const href = `images/${filename}`;

    return {
      id: `img-${String(index).padStart(3, '0')}`,
      path,
      href,
      mediaType,
      data: bytes,
    };
  } catch {
    return null;
  }
}

export function extractImagesFromHtml(
  html: string,
  startIndex = 1,
): ImageExtractionResult {
  let index = startIndex;
  const images: ExtractedImage[] = [];

  const replaced = html.replace(
    DATA_URL_REGEX,
    (_match, _full, mimeSub: string, base64: string) => {
      const image = decodeDataUrl(mimeSub, base64, index);
      if (!image) {
        return _match;
      }
      images.push(image);
      index += 1;
      return `src="../images/${image.href.split('/').pop()}"`;
    },
  );

  return { html: replaced, images };
}

export function extractCoverImage(
  coverDataUrl: string | null,
): ExtractedImage | null {
  if (!coverDataUrl) return null;

  const match = coverDataUrl.match(
    /^data:image\/(jpeg|jpg|png|gif|webp|avif|bmp|svg\+xml|tiff|heic|heif|apng);base64,(.+)$/i,
  );
  if (!match) return null;

  const [, mimeSub, base64] = match;
  const image = decodeDataUrl(mimeSub, base64, 0);
  if (!image) return null;

  const ext = getExtensionFromMimeSub(mimeSub);
  const mediaType = getMimeType(ext);

  return {
    ...image,
    id: 'cover-image',
    path: `OEBPS/images/cover.${ext}`,
    href: `images/cover.${ext}`,
    mediaType,
  };
}

export function estimateDataUrlSize(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1];
  if (!base64) return 0;
  return Math.ceil((base64.length * 3) / 4);
}

export function countDataUrlsInHtml(html: string): number {
  return (html.match(/data:image\//gi) ?? []).length;
}
