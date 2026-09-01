import { useState } from "react";
import type { AppDataApi } from "../lib/storage";
import { genId, nowIso } from "../lib/storage";
import type { StretchRoutine } from "../lib/types";

export default function Stretches({ data }: { data: AppDataApi }) {
  const { stretches, setStretches } = data;
  const [editing, setEditing] = useState<StretchRoutine | "new" | null>(
    null,
  );

  function remove(id: string) {
    if (!window.confirm("Delete this stretch/warm-up routine?")) return;
    setStretches((prev) => prev.filter((s) => s.id !== id));
  }

  function save(routine: StretchRoutine) {
    setStretches((prev) => {
      const exists = prev.some((s) => s.id === routine.id);
      return exists
        ? prev.map((s) => (s.id === routine.id ? routine : s))
        : [routine, ...prev];
    });
    setEditing(null);
  }

  return (
    <div>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Save stretches and warm-up routines here, then attach them to a
        workout template so they surface automatically before you start.
      </p>

      <button
        type="button"
        className="btn btn-block"
        style={{
          marginBottom: "1.25rem",
          background: "var(--stretch-accent)",
          borderColor: "var(--stretch-accent)",
          color: "#04231a",
        }}
        onClick={() => setEditing("new")}
      >
        + New stretch / warm-up
      </button>

      {stretches.length === 0 ? (
        <div className="empty-state">
          <span className="icon">❤</span>
          <p>No stretch or warm-up routines yet.</p>
        </div>
      ) : (
        <div className="list">
          {stretches.map((s) => (
            <div className="card stretch-card" key={s.id}>
              <div className="row" style={{ alignItems: "flex-start" }}>
                <h3 style={{ margin: 0 }}>{s.name}</h3>
                <div className="row-actions">
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => setEditing(s)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => remove(s.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {s.description && (
                <p style={{ marginTop: "0.4rem" }}>{s.description}</p>
              )}
              <div className="row-actions" style={{ marginTop: "0.3rem" }}>
                {s.durationMinutes ? (
                  <span className="pill pill-stretch">
                    {s.durationMinutes} min
                  </span>
                ) : null}
                {s.muscleGroup ? (
                  <span className="pill pill-stretch">{s.muscleGroup}</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <StretchModal
          routine={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function StretchModal({
  routine,
  onCancel,
  onSave,
}: {
  routine: StretchRoutine | null;
  onCancel: () => void;
  onSave: (s: StretchRoutine) => void;
}) {
  const [name, setName] = useState(routine?.name ?? "");
  const [description, setDescription] = useState(routine?.description ?? "");
  const [durationMinutes, setDurationMinutes] = useState(
    routine?.durationMinutes ? String(routine.durationMinutes) : "",
  );
  const [muscleGroup, setMuscleGroup] = useState(routine?.muscleGroup ?? "");

  function submit() {
    const cleanName = name.trim();
    if (!cleanName) {
      window.alert("Give the routine a name.");
      return;
    }
    const now = nowIso();
    onSave({
      id: routine?.id ?? genId(),
      name: cleanName,
      description: description.trim() || undefined,
      durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
      muscleGroup: muscleGroup.trim() || undefined,
      createdAt: routine?.createdAt ?? now,
      updatedAt: now,
    });
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h3>{routine ? "Edit routine" : "New stretch / warm-up"}</h3>
        <div className="field">
          <label htmlFor="stretch-name">Name</label>
          <input
            id="stretch-name"
            placeholder="e.g. Shoulder Mobility"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="stretch-desc">Description</label>
          <textarea
            id="stretch-desc"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Band pull-aparts, arm circles, cat-cow..."
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="stretch-duration">Duration (min)</label>
            <input
              id="stretch-duration"
              type="number"
              min={0}
              inputMode="numeric"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </div>
          <div className="field" style={{ gridColumn: "span 2" }}>
            <label htmlFor="stretch-muscle">Target muscle group</label>
            <input
              id="stretch-muscle"
              placeholder="e.g. Shoulders"
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
            />
          </div>
        </div>
        <div className="row" style={{ gap: "0.6rem" }}>
          <button type="button" className="btn btn-block" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-block"
            style={{
              background: "var(--stretch-accent)",
              borderColor: "var(--stretch-accent)",
              color: "#04231a",
            }}
            onClick={submit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
