import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./admin/AdminDashboard";
import UsersList from "./admin/UsersList";
import AddUser from "./admin/AddUser";
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
         />
         <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <UsersList />
            </ProtectedAdminRoute>
          } 
        />
        <Route
          path="/admin/add-user"
          element={
            <ProtectedAdminRoute>
              <AddUser />
            </ProtectedAdminRoute>
          } 
        />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;