import './App.css';
import LoginForm from './components/LoginForm';
import { Route, Routes } from "react-router-dom";
import SignupForm from './components/SignupForm';

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<SignupForm />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
