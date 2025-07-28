import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx: Starting application...');
console.log('main.tsx: About to render App component');

createRoot(document.getElementById("root")!).render(<App />);
