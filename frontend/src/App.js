import './App.css';
import LoginForm from './components/LoginForm';
import { Route, Routes } from "react-router-dom";
import SignupForm from './components/SignupForm';
import Admin from './components/Admin';
import User from './components/User';
import AdminDashboard from './components/AdminDashboard';
import AdminTasks from './components/AdminTasks';
import ManageUsers from './components/ManageUsers';
import AdminProfile from './components/AdminProfile';

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user" element={<User />} />

          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/adminTasks" element={<AdminTasks />} />
          <Route path="/manageUsers" element={<ManageUsers />} />
          <Route path="/adminProfile" element={<AdminProfile />} />

          <Route path="/" element={<SignupForm />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
