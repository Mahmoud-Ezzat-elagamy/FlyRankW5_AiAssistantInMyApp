'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import ChatInputForm from './ChatInputForm';
import ToolLifecycleRenderer, { TypedToolPart } from './ToolLifecycleRenderer';
import { card } from '@/app/page';

export default function MyAIChat({ addCard, cards, removeCard }: { addCard?: (card: card) => void, cards?: card[], removeCard?: (id: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, status, error } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log(messages)

  const handleSendMessage = useCallback(
    (text: string) => {
      sendMessage({ text }, { body: { cards } });
    },
    [sendMessage, cards]
  );

  // Auto-scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, status, isOpen]);

  const processedToolCallsRef = useRef<Set<string>>(new Set());

  // adding card logic
  useEffect(() => {
    for (const message of messages) {
      if (message.role !== 'assistant' || !message.parts) continue;

      for (const part of message.parts) {
        if (part.type === 'tool-addCard') {
          const toolPart = part as {
            toolCallId?: string;
            output?: {
              id?: string;
              title?: string;
              description?: string;
              tags?: string[] | string;
            };
            input?: {
              id?: string;
              title?: string;
              description?: string;
              tags?: string[] | string;
            };
          };

          const cardData = toolPart.output || toolPart.input;
          const callId = toolPart.toolCallId as string;

          // if the card isn't in the data already ...
          if (cardData?.title && !processedToolCallsRef.current.has(callId)) {
            processedToolCallsRef.current.add(callId);

            const formattedTags = Array.isArray(cardData.tags)
              ? cardData.tags
              : typeof cardData.tags === 'string'
              ? (cardData.tags as string).split(',').map((t) => t.trim())
              : [];

            addCard?.({
              id: cardData.id || crypto.randomUUID(),
              title: cardData.title,
              description: cardData.description || '',
              tags: formattedTags,
            });
          }
        }
      }
    }
  }, [messages, addCard]);

  // the logic for deleting card
  useEffect(
    () => {
      for(const message of messages){
        if(message.role === 'assistant' && message.parts){
          for(const part of message.parts){
            if(part.type === 'tool-removeCard'){
              const toolPart = part as {
                toolCallId?: string;
                output?: {
                  id?: string;
                };
                input?: {
                  id?: string;
                };
              };
              const cardData = toolPart.output || toolPart.input;
              const callId = toolPart.toolCallId as string;
              if(cardData?.id && !processedToolCallsRef.current.has(callId)){
                processedToolCallsRef.current.add(callId);
                removeCard?.(cardData.id);
              }
            }
          }
        }
      }
    }, [messages, removeCard]
  );

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating Vertical Point / Toggle Button in the Top Right */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close AI Chat' : 'Open AI Chat'}
        aria-expanded={isOpen}
        className="fixed top-5 right-5 z-40 group flex items-center gap-2.5 px-3 py-2 bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-100 backdrop-blur-md border border-zinc-200/90 dark:border-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
      >
        {/* Pulsing vertical status point */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>

        {/* AI Chat Label and Icon */}
        <span className="text-xs font-semibold tracking-wide">AI Chat</span>

        <svg
          className={`w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : 'group-hover:translate-x-0.5'
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          )}
        </svg>
      </button>

      {/* Backdrop overlay (dimmed click-outside dismiss) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/25 dark:bg-black/50 backdrop-blur-xs z-45 transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Slide-over Sidebar Drawer */}
      <aside
        role="dialog"
        aria-label="AI Assistant Chat"
        aria-modal="true"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-100 md:w-110 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col transform transition-transform duration-200 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  AI Assistant
                </h2>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Ask questions and chat with AI
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close AI Chat"
            className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm scrollbar-thin scrollbar-track-zinc-50 dark:scrollbar-track-zinc-800 scrollbar-thumb-zinc-200">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 dark:text-zinc-400">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">How can I help you today?</h3>
              <p className="text-xs mt-1 max-w-[240px]">
                Ask any question to get started.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'
                }`}
            >
              <div className="text-[11px] font-medium text-zinc-400 mb-1 px-1">
                {message.role === 'user' ? 'You' : 'AI'}
              </div>

              <div
                className={`max-w-[90%] rounded-2xl p-3 text-sm leading-relaxed ${message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-xs border border-zinc-200/60 dark:border-zinc-700/60'
                  }`}
              >
                {message.parts?.map((part, i) => {
                  if (part.type === 'text') {
                    return (
                      <span key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                        {part.text}
                      </span>
                    );
                  }

                  if (part.type.startsWith('tool-') || part.type === 'dynamic-tool') {
                    return (
                      <ToolLifecycleRenderer
                        key={`${message.id}-${i}`}
                        part={part as TypedToolPart}
                      />
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          ))}

          {(status === 'submitted' || status === 'streaming') && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 italic py-1">
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              {status === 'submitted' ? 'AI is thinking...' : 'AI is typing...'}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-xl text-xs border border-red-200 dark:border-red-900">
              Error: {error.message}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sidebar Footer Input Form (Isolated Component) */}
        <ChatInputForm
          isOpen={isOpen}
          disabled={status === 'streaming' || status === 'submitted'}
          onSend={handleSendMessage}
          placeholder="Ask AI anything..."
        />
      </aside>
    </>
  );
}