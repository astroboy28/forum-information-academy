import { useState } from "react";

const GENDER_OPTIONS = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "O", label: "Other / Prefer not to say" },
];
const GRADE_OPTIONS = [
  { value: "1", label: "1st Year" }, { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" }, { value: "4", label: "4th Year" }, { value: "G", label: "Graduate" },
];
const JLPT_OPTIONS = ["NONE", "N5", "N4", "N3", "N2", "N1"];

const EMPTY = {
  student_number: "", call_name: "", full_name: "", full_name_kana: "",
  gender: "M", birthday: "", nationality: "", telephone_number: "",
  mobile_phone_number: "", email: "", address: "", grade_level: "1",
  department: "", class_name: "", enrollment_date: "", previous_school: "",
  jlpt_level: "NONE", previous_school_attendance_rate: "", present_school_attendance_rate: "",
};

export default function StudentForm({ initial, onSubmit }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial });

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Student number">
          <input className="input" required value={values.student_number} onChange={(e) => update("student_number", e.target.value)} />
        </Field>
        <Field label="Call name">
          <input className="input" required value={values.call_name} onChange={(e) => update("call_name", e.target.value)} />
        </Field>
        <Field label="Full name">
          <input className="input" required value={values.full_name} onChange={(e) => update("full_name", e.target.value)} />
        </Field>
        <Field label="Gender">
          <select className="input" value={values.gender} onChange={(e) => update("gender", e.target.value)}>
            {GENDER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="Birthday">
          <input type="date" className="input" required value={values.birthday} onChange={(e) => update("birthday", e.target.value)} />
        </Field>
        <Field label="Nationality">
          <input className="input" required value={values.nationality} onChange={(e) => update("nationality", e.target.value)} />
        </Field>
        <Field label="Email">
          <input type="email" className="input" required value={values.email} onChange={(e) => update("email", e.target.value)} />
        </Field>
        <Field label="Grade level">
          <select className="input" value={values.grade_level} onChange={(e) => update("grade_level", e.target.value)}>
            {GRADE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="JLPT level">
          <select className="input" value={values.jlpt_level} onChange={(e) => update("jlpt_level", e.target.value)}>
            {JLPT_OPTIONS.map((o) => <option key={o} value={o}>{o === "NONE" ? "Not taken" : o}</option>)}
          </select>
        </Field>
      </div>
      <button type="submit" className="btn-primary">Save student</button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}