import Swipeable from './components/Swipeable';
import { useState, useEffect } from 'react';
import { Vote, Image } from './types';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from './fetchWithAuth';

export default function Reel({ kind_idx, kinds }: { kind_idx: number, kinds: string[] }) {
    const kind = kinds[kind_idx];
    const kind_next = kinds[(kind_idx + 1) % kinds.length];
    const kind_prev = kinds[(kind_idx - 1 + kinds.length) % kinds.length];

  const [images, setImages] = useState<Image[]>([]);
  //const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const [_loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
        // refetches the same images twice for now!
        // but we all start somewhere
      setLoading(true);
      const response = await fetchWithAuth(`/api/images?kind=${kind}`);
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
    setImages([]); // Clear existing images when kind changes
    fetchImages();
  }, [kind]); // Add kind as a dependency

  // Load more when approaching end
//  const handleImageView = (index: number) => {
//    if (index >= images.length - 2 && !loading) {
//      const nextPage = page + 1;
//      setPage(nextPage);
//      fetchImages()
//      // fetchImages(nextPage);
//    }
//  };


  const voteHandler = async (imageIdx: number, voteType: Vote) => {
    const image = images[imageIdx];
    try {
      const response = await fetchWithAuth('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: "1",
          image_id: image.id,
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
    <div className="h-full">
      <div className="flex items-center justify-center gap-4 text-3xl font-bold mb-4">
        <button onClick={() => navigate('/' + kind_prev)} className="hover:text-gray-600">←</button>
        <div>{kind[0].toUpperCase() + kind.slice(1)}Rank</div>
        <button onClick={() => navigate('/' + kind_next)} className="hover:text-gray-600">→</button>
      </div>
      <Swipeable
        onVote={voteHandler}
      >
        {images.map((image, index) => (
          <div key={index} className="relative h-full w-full">
            <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-80 text-white px-3 py-1 rounded">
              <span className="text-xl text-lime-500">{image.name}</span>
            </div>
            <img
              src={image.href}
              alt={image.id}
              title={image.name}
              className="h-full w-full object-contain rounded-lg"
            />
          </div>
        ))}
      </Swipeable>
    </div>
  );
}
