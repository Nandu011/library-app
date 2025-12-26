import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./admin/AdminDashboard";
import AdminStats from "./admin/AdminStats";
import UsersList from "./admin/UsersList";
import AddUser from "./admin/AddUser";
import BooksList from "./admin/BooksList";
import BorrowedBooks from "./admin/BorrowedBooks";
import ProtectedAdminRoute from "./components/ProtectedAdminRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        >
          {/* 👇 THIS is the dashboard home */}
          <Route index element={<AdminStats />} />

          <Route path="users" element={<UsersList />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="/admin/books" element={
            <ProtectedAdminRoute>
              <BooksList />
            </ProtectedAdminRoute>} />
          <Route path="/admin/borrowed" element={<BorrowedBooks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
