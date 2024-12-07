import Show from './Show';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TinderCard from 'react-tinder-card';

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <div className="card-container">
            <TinderCard
              onSwipe={(dir) => console.log('swiped', dir)}
              onCardLeftScreen={() => console.log('card left screen')}
            >
              <Show imageUrl="https://hon.chmod.site/assets/Anatomy_Lesson.jpg" />
            </TinderCard>
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