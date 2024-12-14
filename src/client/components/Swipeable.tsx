import React, { useState, ReactNode } from "react";
import { Vote } from "../types";

interface SwipeableProps {
  children: ReactNode[];
  onVote?: (index: number, vote: Vote) => void;
  kind: string;
}

const Swipeable: React.FC<SwipeableProps> = ({ children, onVote, kind }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex flex-col">
      <div className="flex-grow">
        <div className="h-full overflow-hidden">{children[currentIndex]}</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pl-16 pr-16">
        <div
          className={`flex justify-center gap-4 ${
            {
              art: "bg-green-200 border-green-400",
              cheese: "bg-yellow-200 border-yellow-400",
            }[kind]
          } rounded-lg p-4 shadow-sm border-2`}
        >
          <button
            className="bg-rose-500 text-white p-2 rounded-md w-24 border-2 border-rose-600"
            onClick={() => {
              onVote?.(currentIndex, Vote.NOT);
              setCurrentIndex(currentIndex + 1);
            }}
          >
            Not
          </button>
          <button
            className="bg-lime-500 text-white p-2 rounded-md w-24 border-2 border-lime-600"
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
