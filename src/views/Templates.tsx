import { useState } from "react";
import type { AppDataApi } from "../lib/storage";
import { genId, nowIso } from "../lib/storage";
import ExerciseEditor from "../components/ExerciseEditor";
import { emptyExercise, type EditableExercise } from "../lib/exercise";
import type { WorkoutTemplate } from "../lib/types";

export default function Templates({ data }: { data: AppDataApi }) {
  const { templates, setTemplates, stretches, settings } = data;
  const [editing, setEditing] = useState<WorkoutTemplate | "new" | null>(
    null,
  );

  function remove(id: string) {
    if (!window.confirm("Delete this template?")) return;
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }

  function save(tpl: WorkoutTemplate) {
    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === tpl.id);
      return exists
        ? prev.map((t) => (t.id === tpl.id ? tpl : t))
        : [tpl, ...prev];
    });
    setEditing(null);
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary btn-block"
        style={{ marginBottom: "1.25rem" }}
        onClick={() => setEditing("new")}
      >
        + New template
      </button>

      {templates.length === 0 ? (
        <div className="empty-state">
          <span className="icon">⌘</span>
          <p>
            No templates yet. Save a routine like "Push Day" to quick-select
            it from Log Workout.
          </p>
        </div>
      ) : (
        <div className="list">
          {templates.map((t) => {
            const stretch = stretches.find((s) => s.id === t.stretchRoutineId);
            return (
              <div className="card" key={t.id}>
                <div className="row" style={{ alignItems: "flex-start" }}>
                  <h3 style={{ margin: 0 }}>{t.name}</h3>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => setEditing(t)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => remove(t.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.1rem" }}>
                  {t.exercises.map((ex) => (
                    <li key={ex.id}>
                      {ex.name} — {ex.sets} × {ex.reps} @ {ex.weight}
                      {settings.weightUnit}
                    </li>
                  ))}
                </ul>
                {stretch && (
                  <div style={{ marginTop: "0.6rem" }}>
                    <span className="pill pill-stretch">
                      Warm-up: {stretch.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <TemplateModal
          template={editing === "new" ? null : editing}
          stretches={stretches}
          weightUnit={settings.weightUnit}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function TemplateModal({
  template,
  stretches,
  weightUnit,
  onCancel,
  onSave,
}: {
  template: WorkoutTemplate | null;
  stretches: AppDataApi["stretches"];
  weightUnit: string;
  onCancel: () => void;
  onSave: (t: WorkoutTemplate) => void;
}) {
  const [name, setName] = useState(template?.name ?? "");
  const [exercises, setExercises] = useState<EditableExercise[]>(
    template?.exercises && template.exercises.length > 0
      ? template.exercises
      : [emptyExercise()],
  );
  const [stretchRoutineId, setStretchRoutineId] = useState(
    template?.stretchRoutineId ?? "",
  );

  function submit() {
    const cleanName = name.trim();
    if (!cleanName) {
      window.alert("Give the template a name.");
      return;
    }
    const cleanExercises = exercises
      .map((ex) => ({ ...ex, name: ex.name.trim() }))
      .filter((ex) => ex.name.length > 0);
    if (cleanExercises.length === 0) {
      window.alert("Add at least one exercise.");
      return;
    }
    const now = nowIso();
    onSave({
      id: template?.id ?? genId(),
      name: cleanName,
      exercises: cleanExercises,
      stretchRoutineId: stretchRoutineId || undefined,
      createdAt: template?.createdAt ?? now,
      updatedAt: now,
    });
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <h3>{template ? "Edit template" : "New template"}</h3>
        <div className="field">
          <label htmlFor="tpl-name">Name</label>
          <input
            id="tpl-name"
            placeholder="e.g. Push Day"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label htmlFor="tpl-stretch">Attached warm-up (optional)</label>
          <select
            id="tpl-stretch"
            value={stretchRoutineId}
            onChange={(e) => setStretchRoutineId(e.target.value)}
          >
            <option value="">None</option>
            {stretches.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
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
