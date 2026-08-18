import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import StudentListPage from "./pages/StudentListPage";
import StudentFormPage from "./pages/StudentFormPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import MyProfilePage from "./pages/MyProfilePage";

function DashboardRoot() {
  const { isAdmin } = useAuth();
  return isAdmin ? <StudentListPage /> : <MyProfilePage />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/students" element={<DashboardRoot />} />
            <Route path="/students/new" element={<StudentFormPage />} />
            <Route path="/students/:id" element={<StudentDetailPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/students" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;