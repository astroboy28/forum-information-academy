import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudent } from "../api/students";
import { JLPTBadge, StatusBadge } from "../components/Badges";
import PhotoUploader from "../components/PhotoUploader";

export default function StudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setStudent(null);
    setNotFound(false);
    getStudent(id)
      .then(({ data }) => setStudent(data))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return <p className="p-8">That student wasn't found, or you don't have access to view it.</p>;
  if (!student) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-4">
        <PhotoUploader
          studentId={student.id}
          photoUrl={student.photo}
          fallbackLabel={student.call_name?.[0]?.toUpperCase()}
          onUploaded={(updated) => setStudent((prev) => ({ ...prev, photo: updated.photo }))}
          size={64}
        />
        <div>
          <h1 className="font-display font-bold text-2xl">{student.call_name}</h1>
          <p className="text-sm text-[var(--color-ink-soft)]">{student.full_name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <JLPTBadge level={student.jlpt_level} />
        <StatusBadge active={student.is_active} />
      </div>
    </div>
  );
}