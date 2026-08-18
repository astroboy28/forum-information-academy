import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentListPage from "./pages/StudentListPage";
import StudentFormPage from "./pages/StudentFormPage";
import StudentDetailPage from "./pages/StudentDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/students" element={<StudentListPage />} />
        <Route path="/students/new" element={<StudentFormPage />} />
        <Route path="/students/:id" element={<StudentDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;