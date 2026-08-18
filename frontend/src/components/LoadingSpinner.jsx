export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 text-ink-soft py-8">
      <span className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}