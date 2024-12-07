import Swipeable from './components/Swipeable';
import { useState, useEffect } from 'react';
import { Vote, Image } from './types';

export default function Reel() {
  const [images, setImages] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
        // refetches the same images twice for now!
        // but we all start somewhere
      setLoading(true);
      const response = await fetch(`/api/images`);
      const newImages = await response.json();
      setImages(prev => [...prev, ...newImages]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchImages();
  }, []);

  // Load more when approaching end
//  const handleImageView = (index: number) => {
//    if (index >= images.length - 2 && !loading) {
//      const nextPage = page + 1;
//      setPage(nextPage);
//      fetchImages()
//      // fetchImages(nextPage);
//    }
//  };


  const voteHandler = async (imageId: number, voteType: Vote) => {
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: "1",
          image_id: imageId,
          vote: voteType
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit vote');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error submitting vote:', error);
      throw error;
    }
  };

  return (
    <Swipeable
      onVote={voteHandler}
    >
      {images.map((image, index) => (
        <img
          key={index}
          src={image.href}
          alt={image.id}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ))}
    </Swipeable>
  );
}
