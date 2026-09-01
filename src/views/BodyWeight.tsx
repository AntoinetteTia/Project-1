import { useMemo, useState } from "react";
import type { AppDataApi } from "../lib/storage";
import { genId, nowIso, todayStr } from "../lib/storage";
import { formatDateLong } from "../lib/dates";
import LineChart from "../components/LineChart";
import type { BodyWeightEntry, WeightUnit } from "../lib/types";

export default function BodyWeight({ data }: { data: AppDataApi }) {
  const { bodyWeights, setBodyWeights, settings, setSettings } = data;
  const [date, setDate] = useState(todayStr());
  const [weight, setWeight] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const sortedAsc = useMemo(
    () => [...bodyWeights].sort((a, b) => (a.date < b.date ? -1 : 1)),
    [bodyWeights],
  );
  const sortedDesc = useMemo(() => [...sortedAsc].reverse(), [sortedAsc]);

  function setUnit(unit: WeightUnit) {
    setSettings((prev) => ({ ...prev, weightUnit: unit }));
  }

  function submit() {
    const val = Number(weight);
    if (!weight || Number.isNaN(val) || val <= 0) {
      window.alert("Enter a valid weight.");
      return;
    }
    if (editingId) {
      setBodyWeights((prev) =>
        prev.map((b) =>
          b.id === editingId
            ? { ...b, date, weight: val, updatedAt: nowIso() }
            : b,
        ),
      );
      setEditingId(null);
    } else {
      const entry: BodyWeightEntry = {
        id: genId(),
        date,
        weight: val,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      setBodyWeights((prev) => [entry, ...prev]);
    }
    setDate(todayStr());
    setWeight("");
  }

  function startEdit(entry: BodyWeightEntry) {
    setEditingId(entry.id);
    setDate(entry.date);
    setWeight(String(entry.weight));
  }

  function cancelEdit() {
    setEditingId(null);
    setDate(todayStr());
    setWeight("");
  }

  function remove(id: string) {
    if (!window.confirm("Delete this body weight entry?")) return;
    setBodyWeights((prev) => prev.filter((b) => b.id !== id));
    if (editingId === id) cancelEdit();
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <div className="section-title">
          <label style={{ margin: 0 }}>
            {editingId ? "Edit entry" : "Log body weight"}
          </label>
          <div className="row-actions">
            <button
              type="button"
              className={`btn btn-sm${settings.weightUnit === "lb" ? " btn-primary" : ""}`}
              onClick={() => setUnit("lb")}
            >
              lb
            </button>
            <button
              type="button"
              className={`btn btn-sm${settings.weightUnit === "kg" ? " btn-primary" : ""}`}
              onClick={() => setUnit("kg")}
            >
              kg
            </button>
          </div>
        </div>
        <div className="field-row">
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label htmlFor="bw-date">Date</label>
            <input
              id="bw-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="bw-weight">Weight ({settings.weightUnit})</label>
            <input
              id="bw-weight"
              type="number"
              inputMode="decimal"
              step="0.1"
              min={0}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>
        <div className="row" style={{ gap: "0.5rem" }}>
          {editingId && (
            <button type="button" className="btn btn-block" onClick={cancelEdit}>
              Cancel
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={submit}
          >
            {editingId ? "Save changes" : "Add entry"}
          </button>
        </div>
      </div>

      {sortedAsc.length > 1 && (
        <div className="card" style={{ marginBottom: "1.25rem" }}>
          <label style={{ marginBottom: "0.6rem" }}>Trend</label>
          <LineChart
            points={sortedAsc.map((b) => ({ date: b.date, value: b.weight }))}
            unit={settings.weightUnit}
          />
        </div>
      )}

      {sortedDesc.length === 0 ? (
        <div className="empty-state">
          <span className="icon">⚖️</span>
          <p>No body weight entries yet.</p>
        </div>
      ) : (
        <div className="list">
          {sortedDesc.map((b) => (
            <div className="card row" key={b.id}>
              <div>
                <div>{formatDateLong(b.date)}</div>
                <div className="muted">
                  {b.weight} {settings.weightUnit}
                </div>
              </div>
              <div className="row-actions">
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => startEdit(b)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => remove(b.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
