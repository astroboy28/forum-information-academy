import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listStudents } from "../api/students";
import { useDebounce } from "../hooks/useDebounce";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import { JLPTBadge, StatusBadge } from "../components/Badges";

export default function StudentListPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listStudents({ search: debouncedSearch || undefined, page })
      .then(({ data }) => {
        if (cancelled) return;
        setStudents(data.results);
        setCount(data.count);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load students. Check that the API server is running.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [debouncedSearch, page, retryKey]);

  const totalPages = Math.max(1, Math.ceil(count / 20));

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="font-display font-bold text-2xl mb-4">Students</h1>

      <input
        className="input mb-4 max-w-sm"
        placeholder="Search by name, student number, email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ErrorBanner message={error} onRetry={() => setRetryKey((k) => k + 1)} />

      {loading ? (
        <LoadingSpinner label="Loading students..." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-paper text-left text-ink-soft">
                <th className="px-4 py-3 font-medium">Student #</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Age</th>
                <th className="px-4 py-3 font-medium">Nationality</th>
                <th className="px-4 py-3 font-medium">Class</th>
                <th className="px-4 py-3 font-medium">JLPT</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-paper">
                  <td className="px-4 py-3 font-mono text-xs">{s.student_number}</td>
                  <td className="px-4 py-3">
                    <Link to={`/students/${s.id}`} className="font-medium hover:text-indigo-600">{s.call_name}</Link>
                  </td>
                  <td className="px-4 py-3">{s.age}</td>
                  <td className="px-4 py-3">{s.nationality}</td>
                  <td className="px-4 py-3">{s.class_name}</td>
                  <td className="px-4 py-3"><JLPTBadge level={s.jlpt_level} /></td>
                  <td className="px-4 py-3"><StatusBadge active={s.is_active} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between px-1 py-3 text-sm text-ink-soft">
        <span>{count === 0 ? "No results" : `Page ${page} of ${totalPages} · ${count} students`}</span>
        <div className="flex items-center gap-2">
          <button className="btn-primary py-1.5 px-2.5 disabled:opacity-30" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</button>
          <button className="btn-primary py-1.5 px-2.5 disabled:opacity-30" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</button>
        </div>
      </div>
    </div>
  );
}