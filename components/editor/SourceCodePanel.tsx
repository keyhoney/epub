'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Check, ChevronRight, ChevronDown, Code, TreePine, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SourceCodePanelProps {
  html: string;
  onApply: (html: string) => void;
  onClose: () => void;
  onError?: (message: string) => void;
}

interface TreeNode {
  tag: string;
  attrs: Record<string, string>;
  children: (TreeNode | string)[];
}

function parseHtmlToTree(html: string): TreeNode | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.querySelector('div');
  if (!root) return null;
  return buildTree(root);
}

function buildTree(el: Element): TreeNode {
  const attrs: Record<string, string> = {};
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    attrs[attr.name] = attr.value;
  }
  const children: (TreeNode | string)[] = [];
  for (const node of el.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      children.push(buildTree(node as Element));
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) children.push(text);
    }
  }
  return { tag: el.tagName.toLowerCase(), attrs, children };
}

function TreeNodeView({
  node,
  depth,
  selectedPath,
  onSelect,
  path,
}: {
  node: TreeNode | string;
  depth: number;
  selectedPath: string;
  onSelect: (path: string) => void;
  path: string;
}) {
  if (typeof node === 'string') {
    return (
      <div
        className={cn(
          'px-2 py-0.5 text-xs cursor-pointer rounded hover:bg-slate-100',
          selectedPath === path ? 'bg-blue-100 text-blue-700' : 'text-slate-600',
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(path)}
      >
        <span className="text-slate-400">"{node.slice(0, 80)}{node.length > 80 ? '…' : ''}"</span>
      </div>
    );
  }

  const [collapsed, setCollapsed] = useState(depth >= 4);
  const hasChildren = node.children.length > 0;
  const attrString = Object.entries(node.attrs)
    .map(([k, v]) => ` ${k}="${v}"`)
    .join('');

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-0.5 text-xs cursor-pointer rounded hover:bg-slate-100 font-mono',
          selectedPath === path ? 'bg-blue-100 text-blue-700' : 'text-slate-700',
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(path)}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setCollapsed((v) => !v); }}
            className="p-0.5 hover:bg-slate-200 rounded shrink-0"
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <span className="text-blue-600">&lt;{node.tag}</span>
        <span className="text-green-700">{attrString}</span>
        <span className="text-blue-600">&gt;</span>
        {!hasChildren && <span className="text-blue-600">&lt;/{node.tag}&gt;</span>}
      </div>
      {!collapsed && hasChildren && (
        <div>
          {node.children.map((child, i) => (
            <TreeNodeView
              key={i}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
              path={`${path}/${i}`}
            />
          ))}
          <div
            className={cn(
              'px-2 py-0.5 text-xs cursor-pointer rounded hover:bg-slate-100 font-mono text-blue-600',
              selectedPath === `${path}/-close` ? 'bg-blue-100' : '',
            )}
            style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
            onClick={() => onSelect(`${path}/-close`)}
          >
            &lt;/{node.tag}&gt;
          </div>
        </div>
      )}
    </div>
  );
}

function collectStyles(el: Element | null): Record<string, string> {
  if (!el) return {};
  const styles: Record<string, string> = {};
  const computed = getComputedStyle(el);
  const inheritedProps = [
    'color', 'font-family', 'font-size', 'font-style', 'font-weight',
    'line-height', 'text-align', 'text-indent', 'letter-spacing',
    'word-spacing', 'white-space', 'direction', 'visibility',
  ];
  const allProps = [
    ...inheritedProps,
    'background-color', 'background', 'border', 'border-radius',
    'padding', 'margin', 'width', 'height', 'display', 'position',
    'top', 'right', 'bottom', 'left', 'float', 'clear',
    'overflow', 'opacity', 'box-shadow', 'text-decoration',
    'text-transform', 'vertical-align',
  ];
  for (const prop of allProps) {
    const value = computed.getPropertyValue(prop);
    if (value && value !== '' && value !== 'none' && value !== 'normal' && value !== '0px') {
      styles[prop] = value;
    }
  }
  return styles;
}

function StylesPanel({ html, selectedTag }: { html: string; selectedTag: string }) {
  const [computedStyles, setComputedStyles] = useState<Record<string, string>>({});
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const load = () => {
      const iframeDoc = iframe.contentDocument;
      if (!iframeDoc) return;
      iframeDoc.open();
      iframeDoc.write(`<div>${html}</div>`);
      iframeDoc.close();
      if (selectedTag) {
        try {
          const el = iframeDoc.querySelector(selectedTag);
          if (el) setComputedStyles(collectStyles(el));
          else setComputedStyles({});
        } catch { setComputedStyles({}); }
      } else {
        const el = iframeDoc.body.firstElementChild;
        if (el) setComputedStyles(collectStyles(el as Element));
      }
    };
    iframe.addEventListener('load', load);
    return () => iframe.removeEventListener('load', load);
  }, [html, selectedTag]);

  const styleEntries = useMemo(
    () => Object.entries(computedStyles).sort(([a], [b]) => a.localeCompare(b)),
    [computedStyles],
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="text-[10px] text-slate-400 px-3 py-1 border-b border-slate-100 bg-slate-50 shrink-0">
        {selectedTag ? `${selectedTag} 요소 스타일` : '루트 요소 스타일'}
      </div>
      <iframe ref={iframeRef} className="hidden" title="style-inspector" />
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {styleEntries.length === 0 ? (
          <p className="text-xs text-slate-400 p-2">선택한 요소가 없습니다. DOM 트리에서 요소를 클릭하세요.</p>
        ) : (
          styleEntries.map(([prop, value]) => (
            <div key={prop} className="flex gap-2 text-[11px] font-mono px-2 py-0.5 hover:bg-slate-50 rounded">
              <span className="text-red-700 shrink-0 min-w-[120px]">{prop}</span>
              <span className="text-slate-600">:</span>
              <span className="text-blue-700 break-all">{value}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function SourceCodePanel({
  html,
  onApply,
  onClose,
  onError,
}: SourceCodePanelProps) {
  const [tab, setTab] = useState<'source' | 'tree' | 'styles'>('source');
  const [source, setSource] = useState(html);
  const [selectedPath, setSelectedPath] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    setSource(html);
  }, [html]);

  const tree = useMemo(() => parseHtmlToTree(html), [html]);

  const handleApply = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div>${source}</div>`, 'text/html');
      const err = doc.querySelector('parsererror');
      if (err) {
        onError?.('HTML 구문이 올바르지 않습니다.');
        return;
      }
      onApply(source);
      onClose();
    } catch {
      onError?.('HTML을 적용할 수 없습니다.');
    }
  };

  const handleTreeSelect = (path: string) => {
    setSelectedPath(path);
    if (!tree) return;
    const parts = path.split('/').filter(Boolean).map(Number);
    let current: TreeNode | string | undefined = tree;
    for (const p of parts) {
      if (typeof current !== 'object' || !current) break;
      if (isNaN(p) || p >= current.children.length) break;
      current = current.children[p];
    }
    if (current && typeof current === 'object') {
      setSelectedTag(current.tag);
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-20 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50 shrink-0">
        <div className="flex gap-1">
          {([
            { id: 'source' as const, label: 'HTML 소스', icon: Code },
            { id: 'tree' as const, label: 'DOM 트리', icon: TreePine },
            { id: 'styles' as const, label: '스타일 검사', icon: FileCode },
          ]).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 text-xs rounded',
                tab === t.id
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-slate-500 hover:bg-slate-100',
              )}
            >
              <t.icon className="w-3 h-3" />
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {tab === 'source' && (
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded"
            >
              <Check className="w-3 h-3" />
              적용
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {tab === 'source' && (
        <textarea
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none"
          spellCheck={false}
        />
      )}

      {tab === 'tree' && (
        <div className="flex-1 overflow-y-auto py-2">
          {tree ? (
            <TreeNodeView
              node={tree}
              depth={0}
              selectedPath={selectedPath}
              onSelect={handleTreeSelect}
              path="0"
            />
          ) : (
            <p className="text-xs text-slate-400 p-4">HTML을 파싱할 수 없습니다.</p>
          )}
        </div>
      )}

      {tab === 'styles' && (
        <StylesPanel html={html} selectedTag={selectedTag} />
      )}
    </div>
  );
}
