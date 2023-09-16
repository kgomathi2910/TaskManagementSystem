import './App.css';
import LoginForm from './components/LoginForm';
import { Route, Routes } from "react-router-dom";
import SignupForm from './components/SignupForm';

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
