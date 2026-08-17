import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentListPage from "./pages/StudentListPage";
import StudentDetail from "./StudentDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/students" element={<StudentListPage />} />
        <Route path="/students/:id" element={<StudentDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;