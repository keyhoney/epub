'use client';

import { useRef, useState } from 'react';
import { ChevronDown, ImageIcon, Plus, Trash2, X } from 'lucide-react';
import type {
  BookMetadata,
  Contributor,
  ContributorRole,
} from '@/lib/types/book';
import {
  CONTRIBUTOR_ROLE_OPTIONS,
  LANGUAGE_OPTIONS,
} from '@/lib/types/book';
import { cn } from '@/lib/utils';

type AccordionSection = 'basic' | 'publishing' | 'classification';

interface BookMetadataFormProps {
  metadata: BookMetadata;
  onMetadataChange: (updates: Partial<BookMetadata>) => void;
}

function AccordionHeader({
  title,
  open,
  onToggle,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700"
    >
      {title}
      <ChevronDown
        className={cn('w-4 h-4 transition-transform', open && 'rotate-180')}
      />
    </button>
  );
}

const inputClass =
  'w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400';

export function BookMetadataForm({
  metadata,
  onMetadataChange,
}: BookMetadataFormProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [openSections, setOpenSections] = useState<Record<AccordionSection, boolean>>({
    basic: true,
    publishing: false,
    classification: false,
  });
  const [subjectInput, setSubjectInput] = useState('');
  const [newContributorRole, setNewContributorRole] =
    useState<ContributorRole>('translator');
  const [newContributorName, setNewContributorName] = useState('');

  const toggleSection = (section: AccordionSection) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('표지 이미지는 10MB 이하여야 합니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onMetadataChange({ coverImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const addSubject = () => {
    const tag = subjectInput.trim();
    if (!tag || metadata.subjects.includes(tag)) return;
    onMetadataChange({ subjects: [...metadata.subjects, tag] });
    setSubjectInput('');
  };

  const removeSubject = (tag: string) => {
    onMetadataChange({
      subjects: metadata.subjects.filter((s) => s !== tag),
    });
  };

  const addContributor = () => {
    const name = newContributorName.trim();
    if (!name) return;
    const contributor: Contributor = {
      id: crypto.randomUUID(),
      role: newContributorRole,
      name,
    };
    onMetadataChange({ contributors: [...metadata.contributors, contributor] });
    setNewContributorName('');
  };

  const removeContributor = (id: string) => {
    onMetadataChange({
      contributors: metadata.contributors.filter((c) => c.id !== id),
    });
  };

  const updateContributor = (
    id: string,
    updates: Partial<Pick<Contributor, 'role' | 'name'>>,
  ) => {
    onMetadataChange({
      contributors: metadata.contributors.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
      ),
    });
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        책 정보
      </h2>

      <div className="border border-slate-100 rounded-lg px-3">
        <AccordionHeader
          title="기본 정보"
          open={openSections.basic}
          onToggle={() => toggleSection('basic')}
        />
        {openSections.basic && (
          <div className="pb-3 space-y-2 border-t border-slate-100 pt-2">
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={metadata.title}
                onChange={(e) => onMetadataChange({ title: e.target.value })}
                className={inputClass}
                placeholder="책 제목"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">부제목</label>
              <input
                type="text"
                value={metadata.subtitle}
                onChange={(e) =>
                  onMetadataChange({ subtitle: e.target.value })
                }
                className={inputClass}
                placeholder="부제목 (선택)"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">
                주 저자 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={metadata.author}
                onChange={(e) => onMetadataChange({ author: e.target.value })}
                className={inputClass}
                placeholder="저자명"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">언어</label>
              <select
                value={metadata.language}
                onChange={(e) =>
                  onMetadataChange({ language: e.target.value })
                }
                className={inputClass}
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">소개</label>
              <textarea
                value={metadata.description}
                onChange={(e) =>
                  onMetadataChange({ description: e.target.value })
                }
                rows={3}
                className={cn(inputClass, 'resize-none')}
                placeholder="책 소개 (선택)"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">표지 이미지</label>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-dashed border-slate-300 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                {metadata.coverImage ? '표지 변경' : '표지 업로드'}
              </button>
              {metadata.coverImage && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={metadata.coverImage}
                    alt="표지 미리보기"
                    className="w-full h-32 object-cover rounded-md border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => onMetadataChange({ coverImage: null })}
                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border border-slate-100 rounded-lg px-3">
        <AccordionHeader
          title="출판 정보"
          open={openSections.publishing}
          onToggle={() => toggleSection('publishing')}
        />
        {openSections.publishing && (
          <div className="pb-3 space-y-2 border-t border-slate-100 pt-2">
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">출판사</label>
              <input
                type="text"
                value={metadata.publisher}
                onChange={(e) =>
                  onMetadataChange({ publisher: e.target.value })
                }
                className={inputClass}
                placeholder="출판사 (선택)"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">발행일</label>
              <input
                type="date"
                value={metadata.publishedDate}
                onChange={(e) =>
                  onMetadataChange({ publishedDate: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">ISBN</label>
              <input
                type="text"
                value={metadata.isbn}
                onChange={(e) => onMetadataChange({ isbn: e.target.value })}
                className={inputClass}
                placeholder="978-89-XXXX-XXXX-X"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-slate-500">기여자</label>
              {metadata.contributors.map((c) => (
                <div key={c.id} className="flex gap-1 items-center">
                  <select
                    value={c.role}
                    onChange={(e) =>
                      updateContributor(c.id, {
                        role: e.target.value as ContributorRole,
                      })
                    }
                    className="w-24 shrink-0 px-1.5 py-1.5 text-xs border border-slate-200 rounded-md"
                  >
                    {CONTRIBUTOR_ROLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) =>
                      updateContributor(c.id, { name: e.target.value })
                    }
                    className={cn(inputClass, 'flex-1 min-w-0')}
                  />
                  <button
                    type="button"
                    onClick={() => removeContributor(c.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-1 items-center">
                <select
                  value={newContributorRole}
                  onChange={(e) =>
                    setNewContributorRole(e.target.value as ContributorRole)
                  }
                  className="w-24 shrink-0 px-1.5 py-1.5 text-xs border border-slate-200 rounded-md"
                >
                  {CONTRIBUTOR_ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newContributorName}
                  onChange={(e) => setNewContributorName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addContributor();
                    }
                  }}
                  className={cn(inputClass, 'flex-1 min-w-0')}
                  placeholder="이름"
                />
                <button
                  type="button"
                  onClick={addContributor}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border border-slate-100 rounded-lg px-3">
        <AccordionHeader
          title="분류·권리"
          open={openSections.classification}
          onToggle={() => toggleSection('classification')}
        />
        {openSections.classification && (
          <div className="pb-3 space-y-2 border-t border-slate-100 pt-2">
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">주제 태그</label>
              <div className="flex flex-wrap gap-1 mb-1">
                {metadata.subjects.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeSubject(tag)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSubject();
                    }
                  }}
                  className={cn(inputClass, 'flex-1')}
                  placeholder="장르·주제 입력 후 Enter"
                />
                <button
                  type="button"
                  onClick={addSubject}
                  className="px-2 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-md"
                >
                  추가
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">시리즈명</label>
              <input
                type="text"
                value={metadata.series}
                onChange={(e) => onMetadataChange({ series: e.target.value })}
                className={inputClass}
                placeholder="시리즈 (선택)"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">권수</label>
              <input
                type="number"
                min={1}
                value={metadata.seriesIndex ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onMetadataChange({
                    seriesIndex: val ? parseInt(val, 10) : null,
                  });
                }}
                className={inputClass}
                placeholder="1"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">저작권</label>
              <input
                type="text"
                value={metadata.copyright}
                onChange={(e) =>
                  onMetadataChange({ copyright: e.target.value })
                }
                className={inputClass}
                placeholder="© 2026 저자명. All rights reserved."
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-slate-500">이용 권리</label>
              <textarea
                value={metadata.rights}
                onChange={(e) => onMetadataChange({ rights: e.target.value })}
                rows={2}
                className={cn(inputClass, 'resize-none')}
                placeholder="배포·이용 범위 (선택)"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
