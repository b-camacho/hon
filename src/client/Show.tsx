import { useEffect, useState } from 'react';

export default function Show({ imageUrl }: { imageUrl: string }) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Example image array - replace with your actual image URLs
  const images = [
    imageUrl,
    'url2',
    'url3',
    // Add more images as needed
  ];

  // Minimum swipe distance required (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentIndex((prevIndex) => {
        if (prevIndex === images.length - 1) return 0;
        return prevIndex + 1;
      });
    }
    if (isRightSwipe) {
      setCurrentIndex((prevIndex) => {
        if (prevIndex === 0) return images.length - 1;
        return prevIndex - 1;
      });
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}
    >
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'hidden'
        }}
      >
        <img 
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  );
}