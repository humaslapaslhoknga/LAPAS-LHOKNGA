import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { startPortal } from './portalScript';

// Initialize backend API bridge for window.callBackendApi and window.google
startPortal();

createRoot(document.getElementById('root')!).render(<App />);
