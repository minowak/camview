import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { MainPage } from './pages/MainPage';
import { CameraViewPage } from './pages/CameraViewPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/camera-view/:url" element={<CameraViewPage />} />
      </Routes>
    </Router>
  );
}
