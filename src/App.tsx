import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import MagnetismPage from './pages/MagnetismPage';
import ElectroMagnetism from './pages/ElectroMagnetism';
import { BrowserRouter } from 'react-router';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="magnetism" element={<MagnetismPage />} />
        <Route path="electro-magnetism" element={<ElectroMagnetism />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
