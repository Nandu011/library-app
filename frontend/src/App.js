import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

import AdminDashboard from "./admin/AdminDashboard";
import UsersList from "./admin/UsersList";
import AddUser from "./admin/AddUser";
import AdminStats from "./admin/AdminStats";

import ProtectedAdminRoute from "./components/ProtectedAdminRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Layout */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }>
            {/* Default dashboard */}
            <Route index element={<AdminStats />} />

            {/* Nested admin pages */}
            <Route path="users" element={<UsersList />} />
            <Route path="add-user" element={<AddUserUser />} />
          </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;