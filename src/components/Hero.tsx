export default function Hero() {
  return (
    <div className="max-w-lg text-center space-y-4 relative block min-w-full z-10 py-12">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200/60 dark:border-blue-800/60">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        FlyRank AI Assistant
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Intelligent AI Workspace
      </h1>

      <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md mx-auto">
        Click the{' '}
        <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">
          AI Chat
        </strong>{' '}
        floating point in the top-right corner to open the assistant sidebar.
      </p>
    </div>
  );
}
