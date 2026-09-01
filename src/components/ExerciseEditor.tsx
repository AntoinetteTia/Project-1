import { emptyExercise, type EditableExercise } from "../lib/exercise";

export default function ExerciseEditor({
  exercises,
  onChange,
  weightUnit,
}: {
  exercises: EditableExercise[];
  onChange: (next: EditableExercise[]) => void;
  weightUnit: string;
}) {
  function update(id: string, patch: Partial<EditableExercise>) {
    onChange(
      exercises.map((ex) => (ex.id === id ? { ...ex, ...patch } : ex)),
    );
  }

  function remove(id: string) {
    onChange(exercises.filter((ex) => ex.id !== id));
  }

  function add() {
    onChange([...exercises, emptyExercise()]);
  }

  return (
    <div>
      {exercises.length > 0 && (
        <div
          className="exercise-row"
          style={{ marginBottom: "0.25rem" }}
          aria-hidden="true"
        >
          <span className="muted">Exercise</span>
          <span className="muted">Sets</span>
          <span className="muted">Reps</span>
          <span className="muted">{weightUnit}</span>
          <span />
        </div>
      )}
      {exercises.map((ex) => (
        <div className="exercise-row" key={ex.id}>
          <input
            aria-label="Exercise name"
            placeholder="e.g. Bench Press"
            value={ex.name}
            onChange={(e) => update(ex.id, { name: e.target.value })}
          />
          <input
            aria-label="Sets"
            type="number"
            min={0}
            inputMode="numeric"
            value={ex.sets}
            onChange={(e) => update(ex.id, { sets: Number(e.target.value) })}
          />
          <input
            aria-label="Reps"
            type="number"
            min={0}
            inputMode="numeric"
            value={ex.reps}
            onChange={(e) => update(ex.id, { reps: Number(e.target.value) })}
          />
          <input
            aria-label="Weight"
            type="number"
            min={0}
            step="0.5"
            inputMode="decimal"
            value={ex.weight}
            onChange={(e) =>
              update(ex.id, { weight: Number(e.target.value) })
            }
          />
          <button
            type="button"
            className="icon-btn"
            aria-label="Remove exercise"
            onClick={() => remove(ex.id)}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-sm" onClick={add}>
        + Add exercise
      </button>
    </div>
  );
}
