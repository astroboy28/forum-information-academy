export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="card border-[var(--color-danger-500)]/30 bg-[var(--color-danger-50)] px-4 py-3 flex items-center justify-between gap-4 mb-4">
      <p className="text-sm text-[var(--color-danger-500)] font-medium">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary text-xs py-1.5">
          Try again
        </button>
      )}
    </div>
  );
}