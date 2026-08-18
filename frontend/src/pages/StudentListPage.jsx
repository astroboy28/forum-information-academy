import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listStudents } from "../api/students";
import { useDebounce } from "../hooks/useDebounce";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import { JLPTBadge, StatusBadge } from "../components/Badges";
import { useAuth } from "../context/AuthContext";

const GRADE_OPTIONS = [
  { value: "", label: "All years" },
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
];
const JLPT_OPTIONS = ["", "N1", "N2", "N3", "N4", "N5", "NONE"];

export default function StudentListPage() {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [gradeLevel, setGradeLevel] = useState("");
  const [jlpt, setJlpt] = useState("");
  const [ordering, setOrdering] = useState("student_number");
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, gradeLevel, jlpt, ordering]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listStudents({
      search: debouncedSearch || undefined,
      grade_level: gradeLevel || undefined,
      jlpt_level: jlpt || undefined,
      ordering,
      page,
    })
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
  }, [debouncedSearch, gradeLevel, jlpt, ordering, page, retryKey]);

  const totalPages = Math.max(1, Math.ceil(count / 20));

  function toggleOrdering(field) {
    setOrdering((prev) => (prev === field ? `-${field}` : field));
  }

  function SortableHeader({ field, children }) {
    const active = ordering === field || ordering === `-${field}`;
    const arrow = ordering === field ? "↑" : ordering === `-${field}` ? "↓" : "↕";
    return (
      <th className="px-4 py-3 font-medium">
        <button
          onClick={() => toggleOrdering(field)}
          className={`flex items-center gap-1 ${active ? "text-[var(--color-teal-600)]" : ""}`}
        >
          {children} <span className="text-xs">{arrow}</span>
        </button>
      </th>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display font-bold text-2xl">Students</h1>
        {isAdmin && (
          <Link to="/students/new" className="btn-primary text-sm">
            + Add student
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          className="input max-w-sm"
          placeholder="Search by name, student number, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input w-auto" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)}>
          {GRADE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="input w-auto" value={jlpt} onChange={(e) => setJlpt(e.target.value)}>
          {JLPT_OPTIONS.map((o) => <option key={o} value={o}>{o === "" ? "All JLPT levels" : o}</option>)}
        </select>
      </div>

      <ErrorBanner message={error} onRetry={() => setRetryKey((k) => k + 1)} />

      {loading ? (
        <LoadingSpinner label="Loading students..." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-paper)] text-left text-[var(--color-ink-soft)]">
                <SortableHeader field="student_number">Student #</SortableHeader>
                <SortableHeader field="call_name">Name</SortableHeader>
                <SortableHeader field="birthday">Age</SortableHeader>
                <th className="px-4 py-3 font-medium">Nationality</th>
                <th className="px-4 py-3 font-medium">Class</th>
                <SortableHeader field="jlpt_level">JLPT</SortableHeader>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-paper)]">
                  <td className="px-4 py-3 font-mono text-xs">{s.student_number}</td>
                  <td className="px-4 py-3">
                    <Link to={`/students/${s.id}`} className="font-medium hover:text-[var(--color-teal-600)]">{s.call_name}</Link>
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

      <div className="flex items-center justify-between px-1 py-3 text-sm text-[var(--color-ink-soft)]">
        <span>{count === 0 ? "No results" : `Page ${page} of ${totalPages} · ${count} students`}</span>
        <div className="flex items-center gap-2">
          <button className="btn-primary py-1.5 px-2.5 disabled:opacity-30" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</button>
          <button className="btn-primary py-1.5 px-2.5 disabled:opacity-30" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</button>
        </div>
      </div>
    </div>
  );
}