import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Reel from './Reel';

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <div className="card-container p-4" style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Reel />
          </div>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;