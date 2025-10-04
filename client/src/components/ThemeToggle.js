import '../index.css';
import { useTheme } from './ThemeProvider.js';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="toggleBtn">
      {theme === 'light' ? <Moon size={24} className="moon" />
      : <Sun size={24} className="sun" />}
    </button>
  );
}