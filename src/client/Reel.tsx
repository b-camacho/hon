import Swipeable from './components/Swipeable';
import { useState, useEffect } from 'react';
import { Vote, Image } from './types';

export default function Reel() {
  const [images, setImages] = useState<Image[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchImages = async (_pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/images`);
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
    fetchImages(1);
  }, []);

  // Load more when approaching end
  const handleImageView = (index: number) => {
    if (index >= images.length - 2 && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchImages(nextPage);
    }
  };


  const voteHandler = (idx: number, vote: Vote) => {
    const image = images[idx];
    console.log(`id ${image.id} is ${vote}`);
    handleImageView(idx);
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
