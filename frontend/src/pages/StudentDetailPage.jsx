import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteStudent, getStudent } from "../api/students";
import { useAuth } from "../context/AuthContext";
import { JLPTBadge, StatusBadge } from "../components/Badges";
import PhotoUploader from "../components/PhotoUploader";

const GRADE_LABELS = { "1": "1st Year", "2": "2nd Year", "3": "3rd Year", "4": "4th Year", G: "Graduate" };

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [student, setStudent] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setStudent(null);
    setNotFound(false);
    getStudent(id)
      .then(({ data }) => setStudent(data))
      .catch(() => setNotFound(true));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm(`Remove ${student.call_name} from the roster? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteStudent(id);
      navigate("/students");
    } catch {
      alert("Couldn't delete this student. Please try again.");
      setDeleting(false);
    }
  }

  if (notFound) return <p className="p-8">That student wasn't found, or you don't have access to view it.</p>;
  if (!student) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-3xl">
      <Link to="/students" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-teal-600)] mb-4">
        ← Back to students
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <PhotoUploader
            studentId={student.id}
            photoUrl={student.photo}
            fallbackLabel={student.call_name?.[0]?.toUpperCase()}
            onUploaded={(updated) => setStudent((prev) => ({ ...prev, photo: updated.photo }))}
            size={64}
          />
          <div>
            <h1 className="font-display font-bold text-2xl">{student.call_name}</h1>
            <p className="text-sm text-[var(--color-ink-soft)]">{student.full_name} {student.full_name_kana && `(${student.full_name_kana})`}</p>
          </div>
        </div>
        {isAdmin && (
          <button onClick={handleDelete} disabled={deleting} className="btn-secondary text-[var(--color-danger-500)] disabled:opacity-50">
            {deleting ? "Removing..." : "Remove student"}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <JLPTBadge level={student.jlpt_level} />
        <StatusBadge active={student.is_active} />
      </div>

      <div className="card p-6 mb-4">
        <h2 className="font-display font-semibold text-base mb-4">Overview</h2>
        <dl className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <Item label="Age" value={`${student.age} years old`} />
          <Item label="Nationality" value={student.nationality} />
          <Item label="Grade level" value={GRADE_LABELS[student.grade_level] || student.grade_level} />
          <Item label="Class" value={student.class_name || "—"} />
          <Item label="Department" value={student.department || "—"} />
          <Item label="Enrollment date" value={student.enrollment_date} />
          <Item label="Previous school" value={student.previous_school || "—"} />
        </dl>
      </div>

      <div className="card p-6 mb-4">
        <h2 className="font-display font-semibold text-base mb-4">Contact</h2>
        <dl className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <Item label="Email" value={student.email} />
          <Item label="Telephone" value={student.telephone_number || "—"} />
          <Item label="Mobile" value={student.mobile_phone_number || "—"} />
          <Item label="Address" value={student.address || "—"} />
        </dl>
      </div>

      <div className="card p-6">
        <h2 className="font-display font-semibold text-base mb-4">Attendance</h2>
        <dl className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <Item label="Previous school attendance" value={student.previous_school_attendance_rate != null ? `${student.previous_school_attendance_rate}%` : "—"} />
          <Item label="Present school attendance" value={student.present_school_attendance_rate != null ? `${student.present_school_attendance_rate}%` : "—"} />
        </dl>
      </div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div>
      <dt className="text-[var(--color-ink-soft)] text-xs mb-0.5">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}