import { useEffect, useState } from 'react';

export default function Show({ imageUrl }: { imageUrl: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Example image array - replace with your actual image URLs
  const images = [
    imageUrl,
    'url2',
    'url3',
    // Add more images as needed
  ];

  

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