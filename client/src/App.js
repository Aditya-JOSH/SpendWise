import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import ThemeToggle from './components/ThemeToggle';

function App() {

  useEffect(() => {
    document.documentElement.classList.remove('theme-loading');
  })

  return (
  <div className="App theme-transition">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
      <ThemeToggle />
    </header>
  </div>
  );
}

export default App;
