export interface BlockTemplate {
  id: string;
  label: string;
  description?: string;
  html: string;
  /** 비주얼 스와치용 */
  swatch?: [string, string, string];
  /** 파일 선택 후 figure 삽입 */
  needsImageFile?: boolean;
}

export interface BlockTemplateGroup {
  id: string;
  label: string;
  templates: BlockTemplate[];
}

/** ePub 3.0에서 자주 쓰는 구조 블록 */
export const BLOCK_TEMPLATE_GROUPS: BlockTemplateGroup[] = [
  {
    id: 'callout',
    label: '강조',
    templates: [
      {
        id: 'info-box',
        label: '정보',
        description: '일반 안내 박스',
        swatch: ['#eff6ff', '#3b82f6', '#1e3a8a'],
        html: '<aside class="info-box" data-variant="info"><h2>참고</h2><p>중요한 정보를 여기에 작성하세요.</p></aside>',
      },
      {
        id: 'tip-box',
        label: '팁',
        description: '요령·힌트',
        swatch: ['#ecfdf5', '#10b981', '#047857'],
        html: '<aside class="info-box" data-variant="tip"><h2>팁</h2><p>유용한 요령을 적어 보세요.</p></aside>',
      },
      {
        id: 'warning-box',
        label: '주의',
        description: '경고·주의사항',
        swatch: ['#fffbeb', '#f59e0b', '#b45309'],
        html: '<aside class="info-box" data-variant="warning"><h2>주의</h2><p>실수하기 쉬운 점을 적어 보세요.</p></aside>',
      },
      {
        id: 'example-box',
        label: '예시',
        description: '예시·샘플',
        swatch: ['#f8fafc', '#94a3b8', '#334155'],
        html: '<aside class="info-box" data-variant="example"><h2>예시</h2><p>예시 내용을 작성하세요.</p></aside>',
      },
    ],
  },
  {
    id: 'quote',
    label: '인용',
    templates: [
      {
        id: 'quote-basic',
        label: '기본 인용',
        swatch: ['#f8fafc', '#64748b', '#0f172a'],
        html: '<blockquote class="epub-quote"><p>인용문을 입력하세요.</p></blockquote>',
      },
      {
        id: 'quote-cite',
        label: '출처 인용',
        description: '인용문과 저자',
        swatch: ['#f1f5f9', '#475569', '#0f172a'],
        html: '<blockquote class="epub-quote"><p>인상적인 인용구입니다.</p><cite>— 작가 이름</cite></blockquote>',
      },
      {
        id: 'epigraph',
        label: '에피그래프',
        description: '장 시작 인용',
        swatch: ['#fff', '#94a3b8', '#334155'],
        html: '<blockquote class="epigraph"><p>장을 여는 인용문을 입력하세요.</p><cite>— 출처</cite></blockquote>',
      },
      {
        id: 'pull-quote',
        label: '풀 인용',
        description: '짧은 강조 인용',
        swatch: ['#fef3c7', '#d97706', '#78350f'],
        html: '<blockquote class="epub-quote"><p>강조하고 싶은 한 문장.</p></blockquote>',
      },
    ],
  },
  {
    id: 'structure',
    label: '구조',
    templates: [
      {
        id: 'drop-cap',
        label: '드롭 캡',
        description: '첫 글자 강조 문단',
        swatch: ['#fff', '#1e293b', '#64748b'],
        html: '<p class="drop-cap"><span class="first-letter">첫</span>문단을 이어서 작성하세요.</p>',
      },
      {
        id: 'spacer',
        label: '여백',
        description: '장면 전환·간격',
        html: '<p class="spacer">&nbsp;</p>',
      },
      {
        id: 'page-break',
        label: '페이지 나눔',
        description: '다음 페이지부터 시작',
        html: '<hr class="page-break" />',
      },
    ],
  },
  {
    id: 'table',
    label: '표 빠른삽입',
    templates: [
      {
        id: 'table-2x2',
        label: '2×2 표',
        html: '<table class="epub-table"><tbody><tr><th></th><th></th></tr><tr><td></td><td></td></tr></tbody></table>',
      },
      {
        id: 'table-compare',
        label: '비교 2열',
        description: '항목 / 내용',
        html: '<table class="epub-table"><thead><tr><th>항목</th><th>내용</th></tr></thead><tbody><tr><td>A</td><td></td></tr><tr><td>B</td><td></td></tr></tbody></table>',
      },
      {
        id: 'table-schedule',
        label: '3열 일정',
        html: '<table class="epub-table"><thead><tr><th>단계</th><th>설명</th><th>비고</th></tr></thead><tbody><tr><td>1</td><td></td><td></td></tr><tr><td>2</td><td></td><td></td></tr><tr><td>3</td><td></td><td></td></tr></tbody></table>',
      },
    ],
  },
  {
    id: 'media',
    label: '미디어',
    templates: [
      {
        id: 'figure',
        label: '이미지 + 캡션',
        description: '파일을 선택해 삽입',
        needsImageFile: true,
        html: '',
      },
    ],
  },
];

export const BLOCK_TEMPLATES: BlockTemplate[] = BLOCK_TEMPLATE_GROUPS.flatMap(
  (g) => g.templates,
);

export function buildFigureHtml(src: string, alt = '이미지 설명'): string {
  return `<figure class="epub-figure"><img src="${src}" alt="${alt}" /><figcaption>캡션을 입력하세요</figcaption></figure>`;
}
