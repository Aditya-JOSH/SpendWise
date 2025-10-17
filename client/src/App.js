import './App.css';
import ThemeToggle from './components/ThemeToggle';
import Categories from './components/Categories';
import Login from './components/Login';
import Signup from './components/Signup';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
  <div className="App theme-transition">
    <header className="App-header">
      <Routes>
        <Route path="/" element={<Categories />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <ThemeToggle />
    </header>
  </div>
  );
}

export default App;
