'use client';

import { useState } from 'react';
import type { Editor } from '@tiptap/react';

const MAX_ROWS = 8;
const MAX_COLS = 8;

interface TableInsertPopoverProps {
  editor: Editor;
  onClose: () => void;
}

export function TableInsertPopover({ editor, onClose }: TableInsertPopoverProps) {
  const [hoverRows, setHoverRows] = useState(3);
  const [hoverCols, setHoverCols] = useState(3);
  const [withHeaderRow, setWithHeaderRow] = useState(true);

  const insert = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow })
      .run();
    onClose();
  };

  return (
    <div className="p-3 w-56">
      <p className="text-xs font-medium text-slate-700 mb-2">
        {hoverRows} × {hoverCols} 표
      </p>
      <div
        className="grid gap-0.5 mb-3"
        style={{ gridTemplateColumns: `repeat(${MAX_COLS}, 1fr)` }}
        onMouseLeave={() => {
          setHoverRows(3);
          setHoverCols(3);
        }}
      >
        {Array.from({ length: MAX_ROWS * MAX_COLS }, (_, i) => {
          const row = Math.floor(i / MAX_COLS) + 1;
          const col = (i % MAX_COLS) + 1;
          const active = row <= hoverRows && col <= hoverCols;
          return (
            <button
              key={i}
              type="button"
              className={`w-5 h-5 border rounded-sm transition-colors ${
                active
                  ? 'bg-blue-100 border-blue-400'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
              onMouseEnter={() => {
                setHoverRows(row);
                setHoverCols(col);
              }}
              onClick={() => insert(row, col)}
              aria-label={`${row}행 ${col}열 표 삽입`}
            />
          );
        })}
      </div>
      <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={withHeaderRow}
          onChange={(e) => setWithHeaderRow(e.target.checked)}
          className="rounded border-slate-300"
        />
        첫 행을 머리글로
      </label>
      <div className="mt-2 pt-2 border-t border-slate-100 flex gap-1">
        {[
          { label: '2×2', rows: 2, cols: 2 },
          { label: '3×3', rows: 3, cols: 3 },
          { label: '4×5', rows: 4, cols: 5 },
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => insert(preset.rows, preset.cols)}
            className="flex-1 px-2 py-1 text-[10px] rounded border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
