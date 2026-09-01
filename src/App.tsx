import { useState } from "react";
import Nav from "./components/Nav";
import Dashboard from "./views/Dashboard";
import LogWorkout from "./views/LogWorkout";
import History from "./views/History";
import BodyWeight from "./views/BodyWeight";
import Templates from "./views/Templates";
import Stretches from "./views/Stretches";
import { useAppData } from "./lib/storage";

export type ViewId =
  | "dashboard"
  | "log"
  | "history"
  | "bodyweight"
  | "templates"
  | "stretches";

const TITLES: Record<ViewId, string> = {
  dashboard: "Dashboard",
  log: "Log Workout",
  history: "History",
  bodyweight: "Body Weight",
  templates: "Templates",
  stretches: "Stretches & Warm-ups",
};

export default function App() {
  const [view, setView] = useState<ViewId>("dashboard");
  const data = useAppData();

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>{TITLES[view]}</h1>
      </header>
      <main className="app-main">
        {view === "dashboard" && (
          <Dashboard data={data} onNavigate={setView} />
        )}
        {view === "log" && <LogWorkout data={data} onDone={() => setView("history")} />}
        {view === "history" && <History data={data} />}
        {view === "bodyweight" && <BodyWeight data={data} />}
        {view === "templates" && <Templates data={data} />}
        {view === "stretches" && <Stretches data={data} />}
      </main>
      <Nav active={view} onChange={setView} />
    </div>
  );
}
