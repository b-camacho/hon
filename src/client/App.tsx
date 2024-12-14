import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Top } from "./Top";
import { KindRank } from "./KindRank";

function AppContent() {
  const [jwt, setJwt] = useState<string | null>(
    localStorage.getItem("session_jwt"),
  );

  useEffect(() => {
    const getJwt = async () => {
      if (!jwt) {
        try {
          const response = await fetch("/api/auth");
          const data = await response.json();
          localStorage.setItem("session_jwt", data.jwt);
          setJwt(data.jwt);
        } catch (error) {
          console.error("Error getting JWT:", error);
        }
      }
    };

    getJwt();
  }, [jwt]);

  const kinds = ["cheese", "art"];
  return (
    <>
      <Routes>
        {kinds.map((kind, idx) => (
          <Route
            key={kind}
            path={`/${kind}`}
            element={<KindRank kind={kind} kind_idx={idx} kinds={kinds} />}
          />
        ))}
        {kinds.map((kind) => (
          <Route
            key={"top" + kind}
            path={`/${kind}/top`}
            element={
              <div className="p-4 h-screen">
                <Top  />
              </div>
            }
          />
        ))}
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
