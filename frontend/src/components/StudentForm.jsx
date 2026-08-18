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
    const payload = { ...values };
    // Empty strings aren't valid numbers - send null instead if left blank
    ["previous_school_attendance_rate", "present_school_attendance_rate"].forEach((f) => {
      if (payload[f] === "") payload[f] = null;
    });
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <h2 className="font-display font-semibold text-base mb-4">Identity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Student number">
            <input className="input" required value={values.student_number} onChange={(e) => update("student_number", e.target.value)} />
          </Field>
          <Field label="Call name">
            <input className="input" required value={values.call_name} onChange={(e) => update("call_name", e.target.value)} />
          </Field>
          <Field label="Full name">
            <input className="input" required value={values.full_name} onChange={(e) => update("full_name", e.target.value)} />
          </Field>
          <Field label="Full name (katakana)">
            <input className="input" value={values.full_name_kana} onChange={(e) => update("full_name_kana", e.target.value)} />
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
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display font-semibold text-base mb-4">Contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Telephone number">
            <input className="input" value={values.telephone_number} onChange={(e) => update("telephone_number", e.target.value)} />
          </Field>
          <Field label="Mobile phone number">
            <input className="input" value={values.mobile_phone_number} onChange={(e) => update("mobile_phone_number", e.target.value)} />
          </Field>
          <Field label="Email">
            <input type="email" className="input" required value={values.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field label="Address">
            <input className="input" value={values.address} onChange={(e) => update("address", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display font-semibold text-base mb-4">Academic placement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Grade level">
            <select className="input" value={values.grade_level} onChange={(e) => update("grade_level", e.target.value)}>
              {GRADE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="Department">
            <input className="input" value={values.department} onChange={(e) => update("department", e.target.value)} />
          </Field>
          <Field label="Class">
            <input className="input" value={values.class_name} onChange={(e) => update("class_name", e.target.value)} />
          </Field>
          <Field label="Enrollment date">
            <input type="date" className="input" required value={values.enrollment_date} onChange={(e) => update("enrollment_date", e.target.value)} />
          </Field>
          <Field label="Previous school">
            <input className="input" value={values.previous_school} onChange={(e) => update("previous_school", e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-display font-semibold text-base mb-4">JLPT & attendance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="JLPT level">
            <select className="input" value={values.jlpt_level} onChange={(e) => update("jlpt_level", e.target.value)}>
              {JLPT_OPTIONS.map((o) => <option key={o} value={o}>{o === "NONE" ? "Not taken" : o}</option>)}
            </select>
          </Field>
          <Field label="Previous school attendance rate (%)">
            <input type="number" step="0.01" min="0" max="100" className="input" value={values.previous_school_attendance_rate} onChange={(e) => update("previous_school_attendance_rate", e.target.value)} />
          </Field>
          <Field label="Present school attendance rate (%)">
            <input type="number" step="0.01" min="0" max="100" className="input" value={values.present_school_attendance_rate} onChange={(e) => update("present_school_attendance_rate", e.target.value)} />
          </Field>
        </div>
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