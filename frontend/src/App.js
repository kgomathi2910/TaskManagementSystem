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

import { Provider } from 'react-redux';
import store from './store/store';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin/:id" element={<Admin />} />
          <Route path="/user" element={<User />} />

          <Route path="/adminDashboard/:id" element={<AdminDashboard />} />
          <Route path="/adminTasks/:id" element={<AdminTasks />} />
          <Route path="/manageUsers/:id" element={<ManageUsers />} />
          <Route path="/adminProfile/:id" element={<AdminProfile />} />

          <Route path="/" element={<SignupForm />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
