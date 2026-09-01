import { useMemo, useRef, useState } from "react";
import type { AppDataApi } from "../lib/storage";
import { daysAgo, formatDateShort, isSameOrAfter, startOfWeek } from "../lib/dates";
import { exportCsv, exportJson, parseImportedJson } from "../lib/exportImport";
import type { ViewId } from "../App";

export default function Dashboard({
  data,
  onNavigate,
}: {
  data: AppDataApi;
  onNavigate: (view: ViewId) => void;
}) {
  const { workouts, bodyWeights, templates, settings, importData } = data;
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const weekStart = useMemo(() => startOfWeek(new Date()), []);
  const workoutsThisWeek = useMemo(
    () => workouts.filter((w) => isSameOrAfter(w.date, weekStart)).length,
    [workouts, weekStart],
  );

  const topExercises = useMemo(() => {
    const counts = new Map<string, number>();
    for (const w of workouts) {
      for (const ex of w.exercises) {
        counts.set(ex.name, (counts.get(ex.name) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [workouts]);

  const recent = useMemo(
    () =>
      [...workouts]
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 5),
    [workouts],
  );

  const latestWeight = useMemo(() => {
    if (bodyWeights.length === 0) return null;
    return [...bodyWeights].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  }, [bodyWeights]);

  const last30 = useMemo(() => daysAgo(30), []);
  const recentWorkoutCount = useMemo(
    () => workouts.filter((w) => isSameOrAfter(w.date, last30)).length,
    [workouts, last30],
  );

  function handleImportFile(file: File) {
    file
      .text()
      .then((text) => {
        const parsed = parseImportedJson(text);
        const summary = [
          parsed.workouts ? `${parsed.workouts.length} workouts` : null,
          parsed.bodyWeights ? `${parsed.bodyWeights.length} weight entries` : null,
          parsed.templates ? `${parsed.templates.length} templates` : null,
          parsed.stretches ? `${parsed.stretches.length} stretch routines` : null,
        ]
          .filter(Boolean)
          .join(", ");
        if (
          !window.confirm(
            `Import will replace your current data with: ${summary || "nothing found"}. Continue?`,
          )
        ) {
          return;
        }
        importData(parsed);
        setImportMsg("Data imported successfully.");
        setTimeout(() => setImportMsg(null), 3000);
      })
      .catch(() => {
        setImportMsg("Could not read that file — is it a valid backup JSON?");
        setTimeout(() => setImportMsg(null), 4000);
      });
  }

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{workoutsThisWeek}</div>
          <div className="stat-label">Workouts this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{recentWorkoutCount}</div>
          <div className="stat-label">Last 30 days</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {latestWeight ? `${latestWeight.weight}${settings.weightUnit}` : "—"}
          </div>
          <div className="stat-label">
            {latestWeight ? `As of ${formatDateShort(latestWeight.date)}` : "No weigh-ins yet"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{templates.length}</div>
          <div className="stat-label">Saved templates</div>
        </div>
      </div>

      <div className="section-title">
        <h2 style={{ fontSize: "1rem", margin: 0 }}>Most-logged exercises</h2>
      </div>
      {topExercises.length === 0 ? (
        <p className="muted">Log a few workouts to see your top exercises.</p>
      ) : (
        <div className="list" style={{ marginBottom: "1.5rem" }}>
          {topExercises.map(([name, count]) => (
            <div className="card row" key={name}>
              <span>{name}</span>
              <span className="pill">{count}×</span>
            </div>
          ))}
        </div>
      )}

      <div className="section-title">
        <h2 style={{ fontSize: "1rem", margin: 0 }}>Recent activity</h2>
        <button type="button" className="btn btn-sm" onClick={() => onNavigate("history")}>
          View all
        </button>
      </div>
      {recent.length === 0 ? (
        <div className="empty-state">
          <span className="icon">📋</span>
          <p>Nothing logged yet — start with Log Workout.</p>
        </div>
      ) : (
        <div className="list" style={{ marginBottom: "1.5rem" }}>
          {recent.map((w) => (
            <div className="card row" key={w.id}>
              <div>
                <div>{formatDateShort(w.date)}</div>
                <div className="muted">
                  {w.templateName ?? "Custom workout"} · {w.exercises.length}{" "}
                  exercise{w.exercises.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="divider" />

      <div className="section-title">
        <h2 style={{ fontSize: "1rem", margin: 0 }}>Your data</h2>
      </div>
      <p className="muted">
        Everything is stored locally in this browser. Back it up regularly.
      </p>
      <div className="row-actions" style={{ marginBottom: "0.75rem" }}>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => exportJson(data.exportData())}
        >
          Export JSON
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => exportCsv(data.exportData())}
        >
          Export CSV
        </button>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => fileRef.current?.click()}
        >
          Import JSON
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImportFile(file);
          e.target.value = "";
        }}
      />
      {importMsg && <p className="muted">{importMsg}</p>}
    </div>
  );
}
