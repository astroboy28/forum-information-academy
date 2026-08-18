import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStudent } from "../api/students";
import StudentForm from "../components/StudentForm";
import ErrorBanner from "../components/ErrorBanner";

export default function StudentFormPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(values) {
    setError(null);
    setFieldErrors({});
    try {
      const { data } = await createStudent(values);
      navigate(`/students/${data.id}`);
    } catch (err) {
      if (err.response?.status === 400) {
        setFieldErrors(err.response.data);
        setError("Please fix the highlighted fields below.");
      } else {
        setError("Couldn't save this student. Check your connection and try again.");
      }
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display font-bold text-2xl mb-6">Add student</h1>
      <ErrorBanner message={error} />
      {Object.keys(fieldErrors).length > 0 && (
        <div className="mb-4 text-sm text-danger-500 space-y-1">
          {Object.entries(fieldErrors).map(([field, msgs]) => (
            <p key={field}><strong>{field}</strong>: {Array.isArray(msgs) ? msgs.join(", ") : msgs}</p>
          ))}
        </div>
      )}
      <StudentForm onSubmit={handleSubmit} />
    </div>
  );
}