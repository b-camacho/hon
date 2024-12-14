import Swipeable from "./components/Swipeable";
import { useState, useEffect } from "react";
import { Vote, Image } from "./types";
import { fetchWithAuth } from "./fetchWithAuth";

export default function Reel({ kind }: { kind: string }) {
  const [images, setImages] = useState<Image[]>([]);

  const [_loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
      // refetches the same images twice for now!
      // but we all start somewhere
      setLoading(true);
      const response = await fetchWithAuth(`/api/images?kind=${kind}`);
      const newImages = await response.json();
      setImages((prev) => [...prev, ...newImages]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    setImages([]); // Clear existing images when kind changes
    fetchImages();
  }, [kind]); // Add kind as a dependency

  const voteHandler = async (imageIdx: number, voteType: Vote) => {
    const image = images[imageIdx];
    try {
      const response = await fetchWithAuth("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "1",
          image_id: image.id,
          vote: voteType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit vote");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error submitting vote:", error);
      throw error;
    }
  };

  return (
    <div className="h-full">
      <Swipeable onVote={voteHandler} kind={kind}>
        {images.map((image, index) => (
          <div key={index} className="relative h-full w-full p-4">
            <div
              className={`h-full w-full rounded-lg border-4 border-yellow-400 ${
                {
                  cheese: "border-yellow-400",
                  art: "border-green-400",
                }[kind]
              }`}
            >
              <div className="absolute top-8 left-8 z-10 bg-black bg-opacity-80 text-white px-3 py-1 rounded">
                <span className="text-xl text-lime-500">{image.name}</span>
              </div>
              <img
                src={image.href}
                alt={image.id}
                title={image.name}
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
          </div>
        ))}
      </Swipeable>
    </div>
  );
}
