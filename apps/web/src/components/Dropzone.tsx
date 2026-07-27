"use client";

import { useCallback, useState } from "react";
import { FileArrowUp, Trash, UploadSimple } from "@phosphor-icons/react";

type Props = {
  accept?: string;
  multiple?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
};

function formatSize(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function Dropzone({ accept, multiple, files, onChange }: Props) {
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (list: FileList | null) => {
      if (!list?.length) return;
      const next = Array.from(list);
      onChange(multiple ? [...files, ...next] : next.slice(0, 1));
    },
    [files, multiple, onChange],
  );

  return (
    <div className="space-y-3">
      <div className="shell">
        <label
          onDragEnter={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`shell-core flex cursor-pointer flex-col items-center justify-center px-6 py-14 text-center transition-colors duration-300 ${
            dragging ? "bg-[var(--accent-soft)]" : ""
          }`}
        >
          <input
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={(e) => addFiles(e.target.files)}
          />
          <span
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 ${
              dragging
                ? "scale-105 bg-[var(--accent)] text-white"
                : "bg-[var(--surface)] text-[var(--accent)]"
            }`}
          >
            {dragging ? (
              <UploadSimple size={26} weight="bold" />
            ) : (
              <FileArrowUp size={26} weight="duotone" />
            )}
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-[var(--ink)]">
            {dragging ? "Release to add" : "Drop files here"}
          </span>
          <span className="mt-1.5 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
            or tap to browse · processed in your browser · no upload for private
            tools
          </span>
        </label>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="shell !p-1">
              <div className="shell-core flex items-center justify-between gap-3 px-3.5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--ink)]">
                    {f.name}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {formatSize(f.size)}
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--stroke)] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                  onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                  aria-label={`Remove ${f.name}`}
                >
                  <Trash size={15} weight="bold" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
