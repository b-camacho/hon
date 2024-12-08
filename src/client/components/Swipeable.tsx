import React, { useState, ReactNode } from 'react';
import { Vote } from '../types';

interface SwipeableProps {
  children: ReactNode[];
  onVote?: (index: number, vote: Vote) => void;
}

const Swipeable: React.FC<SwipeableProps> = ({ children, onVote }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex flex-col">
      <div className="flex-grow">
        <div className="h-full overflow-hidden">
          {children[currentIndex]}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
        <div className="flex justify-center gap-4">
          <button className="bg-rose-500 text-white p-2 rounded-md w-24"
            onClick={() => {
              onVote?.(currentIndex, Vote.NOT);
              setCurrentIndex(currentIndex + 1);
            }}
          >
            Not
          </button>
          <button className="bg-lime-500 text-white p-2 rounded-md w-24"
            onClick={() => {
              onVote?.(currentIndex, Vote.HOT);
              setCurrentIndex(currentIndex + 1);
            }}
          >
            Hot
          </button>
        </div>
      </div>
    </div>
  );
};

export default Swipeable;
