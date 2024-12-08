import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Reel from './Reel';

function AppContent() {
  const kinds = ['cheese', 'art'];
  return (
    <>
      <Routes>
        {kinds.map((kind, idx) => (
          <Route 
            key={kind}
            path={`/${kind}`} 
            element={
              <div className="p-4 h-screen">
                <Reel kind_idx={idx} kinds={kinds}/>
              </div>
            }
          />
        ))}
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