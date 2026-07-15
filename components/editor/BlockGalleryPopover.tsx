'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { BookmarkPlus, LayoutTemplate, Trash2, ChevronDown, Pencil, X, Check } from 'lucide-react';
import {
  BLOCK_TEMPLATE_GROUPS,
  buildFigureHtml,
  type BlockTemplate,
} from '@/lib/editor/blockTemplates';
import { DOMSerializer } from 'prosemirror-model';
import { loadClips, saveClip, deleteClip, renameClip, type UserClip } from '@/lib/editor/clipStorage';
import { cn } from '@/lib/utils';

interface BlockGalleryPopoverProps {
  editor: Editor;
  onImageSizeWarning?: (message: string) => void;
}

export function BlockGalleryPopover({
  editor,
  onImageSizeWarning,
}: BlockGalleryPopoverProps) {
  const [open, setOpen] = useState(false);
  const [groupId, setGroupId] = useState(BLOCK_TEMPLATE_GROUPS[0]?.id ?? '');
  const [userClips, setUserClips] = useState<UserClip[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const promptRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setUserClips(loadClips());
  }, [open]);

  const builtinGroups = groupId === 'my-clips'
    ? BLOCK_TEMPLATE_GROUPS
    : BLOCK_TEMPLATE_GROUPS;

  const activeBuiltin =
    BLOCK_TEMPLATE_GROUPS.find((g) => g.id === groupId) ?? BLOCK_TEMPLATE_GROUPS[0];

  const insert = useCallback((html: string) => {
    editor.chain().focus().insertContent(html).run();
    setOpen(false);
  }, [editor]);

  const handleInsertClip = (clip: UserClip) => {
    insert(clip.html);
  };

  const handleDeleteClip = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteClip(id);
    setUserClips(loadClips());
  };

  const handleRenameClip = (id: string, label: string, desc: string) => {
    renameClip(id, label || '클립');
    setUserClips(loadClips());
  };

  const handleSaveSelection = () => {
    const { empty } = editor.state.selection;
    if (empty) {
      onImageSizeWarning?.('저장할 내용을 선택해주세요.');
      return;
    }

    const { from, to } = editor.state.selection;
    const sliced = editor.state.doc.slice(from, to);
    const div = document.createElement('div');
    try {
      const serializer = DOMSerializer.fromSchema(editor.schema);
      const frag = serializer.serializeFragment(sliced.content);
      div.appendChild(frag as Node);
    } catch {
      div.textContent = editor.state.doc.textBetween(from, to);
    }
    const html = div.innerHTML;
    if (!html.trim()) {
      onImageSizeWarning?.('저장할 내용이 없습니다.');
      return;
    }

    const label = `클립 ${userClips.length + 1}`;
    saveClip({
      id: `clip_${Date.now()}`,
      label,
      html,
      createdAt: Date.now(),
    });
    setUserClips(loadClips());
    onImageSizeWarning?.('클립이 저장되었습니다.');
  };

  const handleFigureFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      onImageSizeWarning?.('이미지는 10MB 이하여야 합니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const html = buildFigureHtml(reader.result as string, file.name);
      insert(html);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const groups = [
    ...BLOCK_TEMPLATE_GROUPS,
    ...(userClips.length > 0
      ? [{ id: 'my-clips' as const, label: '내 클립', templates: [] as BlockTemplate[] }]
      : []),
  ];

  const activeGroup =
    groupId === 'my-clips'
      ? { id: 'my-clips', label: '내 클립', templates: [] as BlockTemplate[] }
      : activeBuiltin;

  return (
    <div className="relative flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
        title="블록 삽입"
        aria-label="블록 삽입"
      >
        <LayoutTemplate className="w-4 h-4" />
        블록
        <ChevronDown className="w-3 h-3" />
      </button>
      <button
        type="button"
        onClick={handleSaveSelection}
        className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded cursor-pointer"
        title="선택 영역을 클립으로 저장"
        aria-label="클립 저장"
      >
        <BookmarkPlus className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-30 flex overflow-hidden">
          <div className="w-20 border-r border-slate-100 bg-slate-50 py-1 shrink-0">
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroupId(g.id)}
                className={cn(
                  'w-full text-left px-2 py-1.5 text-[10px] font-medium',
                  groupId === g.id
                    ? 'bg-white text-blue-700'
                    : 'text-slate-600 hover:bg-white/70',
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="flex-1 p-2 max-h-80 overflow-y-auto space-y-1">
            {groupId === 'my-clips' ? (
              userClips.length === 0 ? (
                <p className="text-xs text-slate-400 p-2">저장된 클립이 없습니다.</p>
              ) : (
                userClips.map((clip) => (
                  <ClipItem
                    key={clip.id}
                    clip={clip}
                    onInsert={() => handleInsertClip(clip)}
                    onDelete={(e) => handleDeleteClip(e, clip.id)}
                    onRename={(label, desc) => handleRenameClip(clip.id, label, desc)}
                  />
                ))
              )
            ) : (
              activeGroup.templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    if (tpl.needsImageFile) {
                      fileRef.current?.click();
                      return;
                    }
                    insert(tpl.html);
                  }}
                  className="w-full text-left p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100"
                >
                  {tpl.swatch && (
                    <div className="flex h-2 rounded overflow-hidden mb-1.5 border border-black/5">
                      {tpl.swatch.map((c, i) => (
                        <span key={i} className="flex-1" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  )}
                  <span className="block text-sm text-slate-800">{tpl.label}</span>
                  {tpl.description && (
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      {tpl.description}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFigureFile}
      />
    </div>
  );
}

function ClipItem({
  clip,
  onInsert,
  onDelete,
  onRename,
}: {
  clip: UserClip;
  onInsert: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onRename: (label: string, description: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(clip.label);

  const handleSubmit = () => {
    onRename(label, '');
    setEditing(false);
  };

  return (
    <div className="group w-full text-left p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100">
      {editing ? (
        <div className="flex items-center gap-1">
          <input
            ref={(el) => el?.focus()}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
              if (e.key === 'Escape') { setLabel(clip.label); setEditing(false); }
            }}
            className="flex-1 text-xs border rounded px-1 py-0.5"
          />
          <button type="button" onClick={handleSubmit} className="p-0.5 text-green-600 hover:bg-green-50 rounded"><Check className="w-3 h-3" /></button>
          <button type="button" onClick={() => { setLabel(clip.label); setEditing(false); }} className="p-0.5 text-slate-400 hover:bg-slate-100 rounded"><X className="w-3 h-3" /></button>
        </div>
      ) : (
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={onInsert}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onInsert(); }}
        >
          <span className="flex-1 text-sm text-slate-800 truncate">{clip.label}</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
            className="p-0.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            title="이름 변경"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-0.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            title="삭제"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
