import { useEffect, useState } from "react";
import { getMyStudentRecord } from "../api/students";
import PhotoUploader from "../components/PhotoUploader";
import { JLPTBadge } from "../components/Badges";

export default function MyProfilePage() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    getMyStudentRecord().then(({ data }) => setStudent(data));
  }, []);

  if (!student) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
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
      <JLPTBadge level={student.jlpt_level} />
    </div>
  );
}