import StudentForm from "../components/StudentForm";

export default function StudentFormPage() {
  function handleSubmit(values) {
    console.log(values);
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-display font-bold text-2xl mb-6">Add student</h1>
      <StudentForm onSubmit={handleSubmit} />
    </div>
  );
}