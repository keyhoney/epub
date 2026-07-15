import EpubStudioClient from './EpubStudioClient';

export default function EpubStudioPage() {
  return (
    <>
      <section className="sr-only" role="region" aria-label="서비스 소개">
        <h1>전자책 만들기 부업 - 무료 EPUB 3.0 온라인 에디터</h1>
        <h2>코딩 지식 없이 바로 시작하는 전자책 만들기</h2>
        <p>
          ePub Studio는 무료로 사용할 수 있는 온라인 EPUB 3.0 에디터입니다.
          복잡한 코딩이나 프로그램 설치 없이 워드프로세서처럼 전자책을
          제작하고 EPUB 파일로 다운로드할 수 있습니다. 부업으로 전자책을
          시작하는 크리에이터에게 적합합니다.
        </p>
        <ul>
          <li>코딩 지식 불필요, 워드프로세서 방식</li>
          <li>회원가입 없이 바로 시작</li>
          <li>실시간 미리보기</li>
          <li>EPUB 3.0 표준 출력</li>
          <li>부업으로 전자책 제작</li>
        </ul>
      </section>
      <EpubStudioClient />
    </>
  );
}
