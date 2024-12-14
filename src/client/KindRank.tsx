import { KindNav } from "./components/KindNav";
import Reel from "./Reel";

interface KindRankProps {
  kind: string;
  kind_idx: number;
  kinds: string[];
}

export const KindRank = ({ kind, kind_idx, kinds }: KindRankProps) => {
  return (
    <div className="relative">
      <div
        className={`absolute inset-0 h-screen w-screen opacity-50 ${
          {
            cheese: "bg-yellow-200 bg-[url('/assets/bg_cheese.png')]",
            art: "bg-green-200 bg-[url('/assets/bg_art.png')]",
          }[kind]
        } bg-repeat`}
      ></div>
      <div className="relative z-10">
        <KindNav kind_idx={kind_idx} kinds={kinds} />
        <Reel kind={kind} />
      </div>
    </div>
  );
};
