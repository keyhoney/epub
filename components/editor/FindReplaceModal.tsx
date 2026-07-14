'use client';

import { useMemo, useState } from 'react';
import type { Editor } from '@tiptap/react';
import type { Chapter } from '@/lib/types/book';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface FindReplaceModalProps {
  editor: Editor | null;
  chapters: Chapter[];
  currentChapterId: string | null;
  onReplaceChapter: (chapterId: string, content: string) => void;
  onClose: () => void;
}

export function FindReplaceModal({
  editor,
  chapters,
  currentChapterId,
  onReplaceChapter,
  onClose,
}: FindReplaceModalProps) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [scope, setScope] = useState<'chapter' | 'all'>('chapter');
  const [result, setResult] = useState<string | null>(null);
  const [matchIndex, setMatchIndex] = useState(0);

  const flags = caseSensitive ? 'g' : 'gi';

  const matchCount = useMemo(() => {
    if (!findText || !editor || scope !== 'chapter') return 0;
    const text = editor.state.doc.textContent;
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, flags);
    return (text.match(regex) ?? []).length;
  }, [findText, editor, scope, flags, result]);

  const findInEditor = (direction: 1 | -1) => {
    if (!editor || !findText) return;
    const { doc } = editor.state;
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, caseSensitive ? '' : 'i');

    type Hit = { from: number; to: number };
    const hits: Hit[] = [];
    doc.descendants((node, pos) => {
      if (!node.isText || !node.text) return;
      let match: RegExpExecArray | null;
      const local = new RegExp(escaped, caseSensitive ? 'g' : 'gi');
      while ((match = local.exec(node.text)) !== null) {
        hits.push({
          from: pos + match.index,
          to: pos + match.index + match[0].length,
        });
      }
    });

    if (hits.length === 0) {
      setResult('일치 항목 없음');
      return;
    }

    const currentPos = editor.state.selection.from;
    let nextIdx =
      direction === 1
        ? hits.findIndex((h) => h.from > currentPos)
        : [...hits].reverse().findIndex((h) => h.from < currentPos);

    if (direction === -1 && nextIdx !== -1) {
      nextIdx = hits.length - 1 - nextIdx;
    }
    if (nextIdx === -1) {
      nextIdx = direction === 1 ? 0 : hits.length - 1;
    }

    const hit = hits[nextIdx];
    editor.chain().focus().setTextSelection({ from: hit.from, to: hit.to }).run();
    setMatchIndex(nextIdx + 1);
    setResult(`${nextIdx + 1} / ${hits.length}`);
  };

  const replaceInString = (text: string) => {
    if (!findText) return { text, count: 0 };
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, flags);
    let count = 0;
    const next = text.replace(regex, () => {
      count += 1;
      return replaceText;
    });
    return { text: next, count };
  };

  const handleReplaceOne = () => {
    if (!editor || !findText || !currentChapterId) return;
    const { from, to, empty } = editor.state.selection;
    if (empty) {
      findInEditor(1);
      return;
    }
    const selected = editor.state.doc.textBetween(from, to);
    const cmp = caseSensitive
      ? selected === findText
      : selected.toLowerCase() === findText.toLowerCase();
    if (!cmp) {
      findInEditor(1);
      return;
    }
    editor.chain().focus().insertContent(replaceText).run();
    onReplaceChapter(currentChapterId, editor.getHTML());
    findInEditor(1);
  };

  const handleReplaceAll = () => {
    if (!findText) return;

    if (scope === 'chapter' && editor && currentChapterId) {
      const html = editor.getHTML();
      const { text, count } = replaceInString(html);
      if (count > 0) {
        editor.commands.setContent(text);
        onReplaceChapter(currentChapterId, text);
      }
      setResult(`${count}건 바꿈`);
      return;
    }

    let total = 0;
    for (const ch of chapters) {
      const { text, count } = replaceInString(ch.content);
      if (count > 0) {
        onReplaceChapter(ch.id, text);
        total += count;
        if (ch.id === currentChapterId && editor) {
          editor.commands.setContent(text, { emitUpdate: false });
        }
      }
    }
    setResult(`전체 ${total}건 바꿈`);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-start justify-center pt-24 z-50">
      <div className="bg-white rounded-xl shadow-xl p-5 w-[400px] max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">찾기 및 바꾸기</h3>
          <button type="button" onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 mb-3">
          {(['chapter', 'all'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScope(s)}
              className={`flex-1 py-1 text-xs rounded ${
                scope === s ? 'bg-blue-600 text-white' : 'bg-slate-100'
              }`}
            >
              {s === 'chapter' ? '현재 장' : '전체 원고'}
            </button>
          ))}
        </div>

        <label className="block text-xs text-slate-500 mb-1">찾을 내용</label>
        <input
          value={findText}
          onChange={(e) => {
            setFindText(e.target.value);
            setResult(null);
          }}
          className="w-full px-2 py-1.5 text-sm border rounded mb-2"
        />
        <label className="block text-xs text-slate-500 mb-1">바꿀 내용</label>
        <input
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
          className="w-full px-2 py-1.5 text-sm border rounded mb-3"
        />

        <label className="flex items-center gap-2 text-xs text-slate-600 mb-3">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
          />
          대소문자 구분
        </label>

        {result && <p className="text-xs text-green-600 mb-2">{result}</p>}
        {scope === 'chapter' && findText && matchCount > 0 && !result?.includes('바꿈') && (
          <p className="text-xs text-slate-500 mb-2">일치 {matchCount}건</p>
        )}

        <div className="flex flex-wrap justify-end gap-2">
          {scope === 'chapter' && (
            <>
              <button
                type="button"
                onClick={() => findInEditor(-1)}
                disabled={!findText}
                className="px-2 py-1.5 text-sm border rounded disabled:opacity-50 flex items-center gap-1"
                title="이전"
              >
                <ChevronUp className="w-4 h-4" />
                이전
              </button>
              <button
                type="button"
                onClick={() => findInEditor(1)}
                disabled={!findText}
                className="px-2 py-1.5 text-sm border rounded disabled:opacity-50 flex items-center gap-1"
                title="다음"
              >
                <ChevronDown className="w-4 h-4" />
                다음
              </button>
              <button
                type="button"
                onClick={handleReplaceOne}
                disabled={!findText}
                className="px-3 py-1.5 text-sm border rounded disabled:opacity-50"
              >
                바꾸기
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handleReplaceAll}
            disabled={!findText}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
          >
            모두 바꾸기
          </button>
        </div>
      </div>
    </div>
  );
}
