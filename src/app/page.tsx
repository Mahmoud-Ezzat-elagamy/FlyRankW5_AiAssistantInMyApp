"use client";

import MyAIChat from "../components/MyAIChat";
import BackGrround from "../components/BackGrround";
import Hero from "../components/Hero";
import CardContainer from "@/components/CardContainer";
import { useState, useCallback, useEffect } from "react";

export type card = {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export default function Chat() {
  const [cards, setCards] = useState<card[]>([]);

  // Load from localStorage only on client mount to avoid SSR ReferenceError
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cards');
      if (stored) {
        setCards(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cards from localStorage:', e);
    }
  }, []);

  // Insert new card at the first position and animate layout shift
  const addCard = useCallback((newCard: card) => {
    setCards((prev) => {
      const next = [newCard, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('cards', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // Remove card with smooth layout transition
  const removeCard = useCallback((id: string) => {
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cards', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-6 relative overflow-hidden">
      {/* Decorative subtle background elements */}
      <BackGrround />

      {/* Hero introduction section */}
      <Hero />

      {/* Cards list - new cards inserted first with smooth position animation */}
      <CardContainer cards={cards} removeCard={removeCard} />

      {/* Slide-over AI Chat Sidebar with Floating Point Trigger */}
      <MyAIChat addCard={addCard} cards={cards} removeCard={removeCard}/>
    </main>
  );
}