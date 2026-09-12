'use client';

import React from 'react';

export type ToolLifecycleState =
  | 'streaming-call'
  | 'call'
  | 'output-available'
  | 'output-error';

export interface CardToolData {
  id?: string;
  title?: string;
  description?: string;
  tags?: string[] | string;
}

export interface TypedToolPart {
  type: string;
  toolCallId?: string;
  state?: ToolLifecycleState | string;
  input?: CardToolData;
  output?: CardToolData;
  errorText?: string;
}

function normalizeTags(tags?: string[] | string): string[] {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string' && tags.trim()) {
    return tags.split(',').map((t) => t.trim());
  }
  return [];
}

export default function ToolLifecycleRenderer({
  part,
}: {
  part: TypedToolPart;
}) {
  const toolName = part.type.replace(/^tool-/, '');
  const state = (part.state || 'call') as ToolLifecycleState;

  const input = part.input;
  const output = part.output;
  const errorText = part.errorText;

  const isRemove = toolName === 'removeCard';

  // 1. INPUT STREAMING STATE
  if (state === 'streaming-call') {
    return (
      <div className="my-2 p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 rounded-xl transition-all duration-200">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="font-mono text-[11px] font-semibold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
              {toolName}
            </span>
          </div>
          <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300">
            {isRemove ? 'Finding card to remove...' : 'Streaming Input...'}
          </span>
        </div>

        <div className="space-y-1.5 pl-4 border-l-2 border-amber-300 dark:border-amber-700">
          <div className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
            {input?.title ? (
              <span>
                Target: <span className="font-semibold">{input.title}</span>
              </span>
            ) : input?.id ? (
              <span>
                ID: <span className="font-mono">{input.id}</span>
              </span>
            ) : (
              <span className="text-zinc-400 italic">
                {isRemove ? 'Locating target card...' : 'Generating title...'}
              </span>
            )}
          </div>
          {input?.description && (
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
              {input.description}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. INPUT AVAILABLE / RUNNING STATE
  if (state === 'call') {
    const tags = normalizeTags(input?.tags);
    const borderColor = isRemove
      ? 'border-rose-200/80 dark:border-rose-800/60 bg-rose-50/70 dark:bg-rose-950/20'
      : 'border-blue-200/80 dark:border-blue-800/60 bg-blue-50/70 dark:bg-blue-950/20';
    const textColor = isRemove
      ? 'text-rose-900 dark:text-rose-200'
      : 'text-blue-900 dark:text-blue-200';
    const badgeColor = isRemove
      ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
      : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300';
    const spinnerColor = isRemove
      ? 'text-rose-600 dark:text-rose-400'
      : 'text-blue-600 dark:text-blue-400';

    return (
      <div className={`my-2 p-3.5 border rounded-xl transition-all duration-200 ${borderColor}`}>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <svg
              className={`w-3.5 h-3.5 animate-spin ${spinnerColor}`}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${textColor}`}>
              {toolName}
            </span>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${badgeColor}`}>
            {isRemove ? 'Deleting...' : 'Executing...'}
          </span>
        </div>

        {/* Input Available details */}
        <div className="bg-white/80 dark:bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800">
          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            {input?.title || (isRemove ? `Removing ID: ${input?.id || '...'}` : 'Creating Card...')}
          </div>
          {input?.description && (
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
              {input.description}
            </p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 text-[10px] rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. OUTPUT AVAILABLE / SUCCESS STATE
  if (state === 'output-available') {
    const data = output || input;
    const tags = normalizeTags(data?.tags);

    if (isRemove) {
      return (
        <div className="my-2 p-3.5 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/60 rounded-xl transition-all duration-200">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-rose-600 dark:bg-rose-500 text-white flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </span>
              <span className="font-mono text-[11px] font-semibold text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                {toolName}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-900/50 px-2 py-0.5 rounded-full">
              Card Removed
            </span>
          </div>

          <div className="bg-white/90 dark:bg-zinc-900/90 p-3 rounded-lg border border-rose-100 dark:border-rose-900/40 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {data?.title ? `Deleted: ${data.title}` : 'Card Removed'}
              </h4>
              <span className="shrink-0 text-[10px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                Removed from UI
              </span>
            </div>
            {data?.id && (
              <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-1">
                ID: {data.id}
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="my-2 p-3.5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl transition-all duration-200">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <span className="font-mono text-[11px] font-semibold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
              {toolName}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
            Completed
          </span>
        </div>

        {/* Output Card Representation */}
        <div className="bg-white/90 dark:bg-zinc-900/90 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {data?.title || 'Card Created'}
            </h4>
            <span className="shrink-0 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              Added to UI
            </span>
          </div>

          {data?.description && (
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
              {data.description}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. OUTPUT ERROR STATE
  if (state === 'output-error') {
    return (
      <div className="my-2 p-3.5 bg-red-50/80 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/60 rounded-xl transition-all duration-200">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
            <span className="font-mono text-[11px] font-semibold text-red-900 dark:text-red-200 uppercase tracking-wider">
              {toolName}
            </span>
          </div>
          <span className="inline-flex items-center text-[10px] font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 px-2 py-0.5 rounded-full">
            Execution Failed
          </span>
        </div>

        <div className="bg-white/80 dark:bg-zinc-900/80 p-2.5 rounded-lg border border-red-100 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300">
          <div className="font-medium">
            {errorText || 'Failed to complete tool operation.'}
          </div>
          {input?.title && (
            <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              Attempted action: &ldquo;{input.title}&rdquo;
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
