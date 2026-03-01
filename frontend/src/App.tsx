import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import TeamPage from "./pages/TeamPage";
import MyTasksPage from "./pages/MyTasksPage";
import { useAuthStore } from "./stores/authStore";

function ProtectedRoute({ children }: { children: JSX.Element }) {

  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/team/:teamId" element={<TeamPage />} />
        <Route path="/my-tasks" element={<MyTasksPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;