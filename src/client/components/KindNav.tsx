import { useNavigate } from "react-router-dom";

export function KindNav({
  kind_idx,
  kinds,
}: {
  kind_idx: number;
  kinds: string[];
}) {
  console.log(kind_idx, kinds[kind_idx]);
  const navigate = useNavigate();
  return (
    <div className="pt-4">
      <div
        className={`p-4 ${
          {
            cheese: "bg-yellow-200 border-yellow-400",
            art: "bg-green-200 border-green-400",
          }[kinds[kind_idx]]
        } border-2`}
      >
        <div className="flex items-center justify-center gap-4 text-3xl font-bold">
          <button
            onClick={() =>
              navigate(
                "/" + kinds[(kind_idx - 1 + kinds.length) % kinds.length],
              )
            }
            className={`hover:text-gray-600 border-2 ${
              {
                cheese: "border-yellow-400",
                art: "border-green-400",
              }[kinds[kind_idx]]
            } rounded px-2 py-1`}
          >
            ←
          </button>
          <div>
            {kinds[kind_idx][0].toUpperCase() + kinds[kind_idx].slice(1)}Rank
          </div>
          <button
            onClick={() => navigate("/" + kinds[(kind_idx + 1) % kinds.length])}
            className={`hover:text-gray-600 border-2 ${
              {
                cheese: "border-yellow-400",
                art: "border-green-400",
              }[kinds[kind_idx]]
            } rounded px-2 py-1`}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
