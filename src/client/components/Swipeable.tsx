import React, { useState, ReactNode } from 'react';
import styles from './Swipeable.module.css';
import { Vote } from '../types';

interface SwipeableProps {
  children: ReactNode[];
  onVote?: (index: number, vote: Vote) => void;
}

const Swipeable: React.FC<SwipeableProps> = ({ children, onVote }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className={styles.container}>
      <div 
        className={styles.content}
     >
        <div>
          {children[currentIndex]}
        </div>
      </div>
      <div className={styles.buttons}>
        <button
          onClick={() => {
            onVote?.(currentIndex, Vote.NOT);
            setCurrentIndex(currentIndex + 1);
          }}
          className={styles.button}
        >
          Not
        </button>
        <button
          onClick={() => {
            onVote?.(currentIndex, Vote.HOT);
              setCurrentIndex(currentIndex + 1);
          }}
          className={styles.button}
        >
          Hot
        </button>
      </div>
    </div>
  );
};

export default Swipeable;
