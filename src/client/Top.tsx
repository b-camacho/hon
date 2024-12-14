import { useEffect, useState } from "react";

interface TopItem {
  name: string;
  hot_votes: number;
  total_votes: number;
}

export function Top() {
  const [data, setData] = useState<TopItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/top"); // Replace with your API endpoint
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-5 overflow-y-auto max-h-[80vh]">
      <div className="flex flex-col gap-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="min-w-[120px] text-right">{item.name}</span>
            <div className="flex-grow bg-gray-100 rounded">
              <div
                className="h-8 bg-blue-500 rounded flex items-center px-3 transition-all duration-300"
                style={{
                  width: `${(item.hot_votes / Math.max(...data.map((d) => d.hot_votes))) * 100}%`,
                }}
              >
                <span className="text-white text-sm">{item.hot_votes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
