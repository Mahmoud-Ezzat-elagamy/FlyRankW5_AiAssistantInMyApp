'use client';

import { useState, useRef, useEffect } from 'react';

export interface ChatInputFormProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  isOpen?: boolean;
  placeholder?: string;
}

export default function ChatInputForm({
  onSend,
  disabled = false,
  isOpen = false,
  placeholder = 'Ask AI or show a modal...',
}: ChatInputFormProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when sidebar opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 backdrop-blur-xs flex items-center gap-2"
    >
      <input
        ref={inputRef}
        className="flex-1 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 px-3.5 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-shadow"
        value={input}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        aria-label="Send message"
        className="h-10 w-10 shrink-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
          />
        </svg>
      </button>
    </form>
  );
}
