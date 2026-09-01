import { useMemo, useState } from "react";
import type { AppDataApi } from "../lib/storage";
import { nowIso } from "../lib/storage";
import { formatDateLong } from "../lib/dates";
import ExerciseEditor from "../components/ExerciseEditor";
import type { EditableExercise } from "../lib/exercise";
import type { WorkoutEntry } from "../lib/types";

function groupByDate(workouts: WorkoutEntry[]) {
  const groups = new Map<string, WorkoutEntry[]>();
  for (const w of workouts) {
    const list = groups.get(w.date) ?? [];
    list.push(w);
    groups.set(w.date, list);
  }
  return [...groups.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

export default function History({ data }: { data: AppDataApi }) {
  const { workouts, setWorkouts, settings } = data;
  const [editing, setEditing] = useState<WorkoutEntry | null>(null);

  const grouped = useMemo(() => groupByDate(workouts), [workouts]);

  function remove(id: string) {
    if (!window.confirm("Delete this workout entry?")) return;
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }

  function saveEdit(updated: WorkoutEntry) {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === updated.id ? { ...updated, updatedAt: nowIso() } : w)),
    );
    setEditing(null);
  }

  if (workouts.length === 0) {
    return (
      <div className="empty-state">
        <span className="icon">🏋️</span>
        <p>No workouts logged yet. Head to Log Workout to get started.</p>
      </div>
    );
  }

  return (
    <div>
      {grouped.map(([date, entries]) => (
        <section key={date} style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {formatDateLong(date)}
          </h3>
          <div className="list">
            {entries.map((w) => (
              <div className="card" key={w.id}>
                <div className="row" style={{ alignItems: "flex-start" }}>
                  <div>
                    {w.templateName && (
                      <span className="pill" style={{ marginBottom: "0.4rem" }}>
                        {w.templateName}
                      </span>
                    )}
                  </div>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => setEditing(w)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => remove(w.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.1rem" }}>
                  {w.exercises.map((ex) => (
                    <li key={ex.id}>
                      {ex.name} — {ex.sets} × {ex.reps} @ {ex.weight}
                      {settings.weightUnit}
                    </li>
                  ))}
                </ul>
                {w.notes && <p style={{ marginTop: "0.5rem" }}>{w.notes}</p>}
              </div>
            ))}
          </div>
        </section>
      ))}

      {editing && (
        <EditWorkoutModal
          workout={editing}
          weightUnit={settings.weightUnit}
          onCancel={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}

function EditWorkoutModal({
  workout,
  weightUnit,
  onCancel,
  onSave,
}: {
  workout: WorkoutEntry;
  weightUnit: string;
  onCancel: () => void;
  onSave: (w: WorkoutEntry) => void;
}) {
  const [date, setDate] = useState(workout.date);
  const [exercises, setExercises] = useState<EditableExercise[]>(
    workout.exercises,
  );
  const [notes, setNotes] = useState(workout.notes ?? "");

  function submit() {
    const cleanExercises = exercises
      .map((ex) => ({ ...ex, name: ex.name.trim() }))
      .filter((ex) => ex.name.length > 0);
    if (cleanExercises.length === 0) {
      window.alert("Add at least one exercise.");
      return;
    }
    onSave({
      ...workout,
      date,
      exercises: cleanExercises,
      notes: notes.trim() || undefined,
    });
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h3>Edit workout</h3>
        <div className="field">
          <label htmlFor="edit-date">Date</label>
          <input
            id="edit-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Exercises</label>
          <ExerciseEditor
            exercises={exercises}
            onChange={setExercises}
            weightUnit={weightUnit}
          />
        </div>
        <div className="field">
          <label htmlFor="edit-notes">Notes</label>
          <textarea
            id="edit-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="row" style={{ gap: "0.6rem" }}>
          <button type="button" className="btn btn-block" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={submit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
