import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudent } from "../api/students";
import { JLPTBadge, StatusBadge } from "../components/Badges";

export default function StudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    getStudent(id).then(({ data }) => setStudent(data));
  }, [id]);

  if (!student) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display font-bold text-2xl mb-1">{student.call_name}</h1>
      <p className="text-sm text-[var(--color-ink-soft)] mb-4">{student.full_name}</p>
      <div className="flex items-center gap-3">
        <JLPTBadge level={student.jlpt_level} />
        <StatusBadge active={student.is_active} />
      </div>
    </div>
  );
}