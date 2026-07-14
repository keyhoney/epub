import {
  type BookState,
  createDefaultMetadata,
} from '@/lib/types/book';
import { DEFAULT_THEME_ID } from '@/lib/epub/themeTokens';

export type BookTemplateId = 'blank' | 'essay' | 'novel' | 'guidebook';

export interface BookTemplateMeta {
  id: BookTemplateId;
  name: string;
  description: string;
}

export const BOOK_TEMPLATES: BookTemplateMeta[] = [
  {
    id: 'blank',
    name: '빈 책',
    description: '장 하나만 있는 깨끗한 시작',
  },
  {
    id: 'essay',
    name: '에세이',
    description: '서문과 본문, 드롭캡·정보 박스 샘플',
  },
  {
    id: 'novel',
    name: '소설',
    description: '서문과 여러 장 골격',
  },
  {
    id: 'guidebook',
    name: '안내서',
    description: '팁·주의 박스와 표 샘플',
  },
];

function chapter(
  title: string,
  order: number,
  content: string,
): BookState['chapters'][number] {
  return {
    id: crypto.randomUUID(),
    title,
    order,
    content,
  };
}

export function createBookFromTemplate(templateId: BookTemplateId): BookState {
  const metadata = createDefaultMetadata();

  switch (templateId) {
    case 'blank':
      return {
        metadata: { ...metadata, title: '새 책' },
        chapters: [
          chapter('제1장', 0, '<p></p>'),
        ],
        readerThemeId: DEFAULT_THEME_ID,
        themeComponents: {},
      };

    case 'essay':
      return {
        metadata: { ...metadata, title: '에세이 제목', author: '' },
        chapters: [
          chapter(
            '서문',
            0,
            `<p class="drop-cap"><span class="first-letter">여</span>기에 서문을 적어 보세요. 독자에게 이 책을 쓰게 된 이유를 간단히 전할 수 있습니다.</p>`,
          ),
          chapter(
            '본문',
            1,
            `<p>본문 내용을 작성하세요.</p>
<aside class="info-box" data-variant="info">
  <h2>안내</h2>
  <p>툴바의 블록 삽입으로 팁·주의 박스, 인용 등을 추가할 수 있습니다.</p>
</aside>
<p>이야기를 이어 가 보세요.</p>`,
          ),
        ],
        readerThemeId: 'theme-classic',
        themeComponents: {},
      };

    case 'novel':
      return {
        metadata: { ...metadata, title: '소설 제목' },
        chapters: [
          chapter(
            '서문',
            0,
            `<p class="drop-cap"><span class="first-letter">이</span> 이야기에는 아직 이름 없는 문이 하나 있습니다.</p>`,
          ),
          chapter('제1장', 1, '<p></p>'),
          chapter('제2장', 2, '<p></p>'),
          chapter('제3장', 3, '<p></p>'),
        ],
        readerThemeId: 'theme-classic',
        themeComponents: {},
      };

    case 'guidebook':
      return {
        metadata: { ...metadata, title: '안내서 제목' },
        chapters: [
          chapter(
            '서문',
            0,
            `<p>이 안내서는 단계별로 따라 할 수 있도록 구성했습니다.</p>
<aside class="info-box" data-variant="tip">
  <h2>팁</h2>
  <p>중요한 요령은 팁 박스로 강조해 보세요.</p>
</aside>
<aside class="info-box" data-variant="warning">
  <h2>주의</h2>
  <p>실수하기 쉬운 부분은 주의 박스로 표시하세요.</p>
</aside>`,
          ),
          chapter(
            '표 샘플',
            1,
            `<p>일정이나 비교는 표로 정리하면 읽기 쉽습니다.</p>
<table class="epub-table">
  <thead>
    <tr><th>항목</th><th>설명</th><th>비고</th></tr>
  </thead>
  <tbody>
    <tr><td>1단계</td><td>준비</td><td>—</td></tr>
    <tr><td>2단계</td><td>실행</td><td>—</td></tr>
    <tr><td>3단계</td><td>확인</td><td>—</td></tr>
  </tbody>
</table>`,
          ),
        ],
        readerThemeId: DEFAULT_THEME_ID,
        themeComponents: {},
      };

    default:
      return createBookFromTemplate('blank');
  }
}
