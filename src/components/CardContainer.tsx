import { card } from '@/app/page';

export default function CardContainer({
    cards,
    removeCard,
}: {
    cards: card[];
    removeCard: (id: string) => void;
}) {
    return (
        <section className="w-full max-w-5xl mx-auto px-4 my-6 relative z-10">
            <style>{`
        /* Smooth View Transition for moving existing cards when a new card is prepended */
        ::view-transition-group(*) {
          animation-duration: 300ms;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Subtle composite entrance animation for newly added cards */
        @keyframes cardPopIn {
          from {
            opacity: 0;
            transform: translateY(-16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-card-enter {
          animation: cardPopIn 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

            <div className="flex items-center justify-between mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        Active Cards
                    </h2>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {cards.length}
                    </span>
                </div>
            </div>

            {cards.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 dark:text-zinc-600 text-sm">
                    No cards yet. Open the AI Chat and say &ldquo;Create a card for Project FlyRank&rdquo;!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card, index) => {
                        // Safe CSS identifier for view transition name
                        const safeIdent = `card_${card.id.replace(/[^a-zA-Z0-9_]/g, '_')}`;

                        return (
                            <div
                                key={card.id}
                                style={{ viewTransitionName: safeIdent }}
                                className={`flex flex-col justify-between p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs hover:shadow-md transition-shadow group ${index === 0 ? 'animate-card-enter' : ''
                                    }`}
                            >
                                <div>
                                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                                        {card.description}
                                    </p>

                                    {card.tags && card.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {card.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/50"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                                    <p className='text-xs text-zinc-400'>ID: {card.id}</p>
                                    <button
                                        type="button"
                                        onClick={() => removeCard(card.id)}
                                        aria-label={`Remove card ${card.title}`}
                                        className="px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}