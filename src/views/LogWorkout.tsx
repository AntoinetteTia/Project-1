import { useMemo, useState } from "react";
import type { AppDataApi } from "../lib/storage";
import { genId, nowIso, todayStr } from "../lib/storage";
import ExerciseEditor from "../components/ExerciseEditor";
import { emptyExercise, type EditableExercise } from "../lib/exercise";
import type { WorkoutEntry } from "../lib/types";

export default function LogWorkout({
  data,
  onDone,
}: {
  data: AppDataApi;
  onDone: () => void;
}) {
  const { templates, stretches, setWorkouts, settings } = data;
  const [date, setDate] = useState(todayStr());
  const [templateId, setTemplateId] = useState<string | undefined>();
  const [exercises, setExercises] = useState<EditableExercise[]>([]);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const selectedTemplate = templates.find((t) => t.id === templateId);
  const warmup = useMemo(
    () =>
      selectedTemplate?.stretchRoutineId
        ? stretches.find((s) => s.id === selectedTemplate.stretchRoutineId)
        : undefined,
    [selectedTemplate, stretches],
  );

  function pickTemplate(id: string) {
    if (templateId === id) {
      setTemplateId(undefined);
      setExercises([]);
      return;
    }
    const tpl = templates.find((t) => t.id === id);
    if (!tpl) return;
    setTemplateId(id);
    setExercises(
      tpl.exercises.map((ex) => ({
        id: genId(),
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
      })),
    );
  }

  function reset() {
    setDate(todayStr());
    setTemplateId(undefined);
    setExercises([]);
    setNotes("");
  }

  function save(andLogAnother: boolean) {
    const cleanExercises = exercises
      .map((ex) => ({ ...ex, name: ex.name.trim() }))
      .filter((ex) => ex.name.length > 0);
    if (cleanExercises.length === 0) {
      window.alert("Add at least one exercise before saving.");
      return;
    }
    const entry: WorkoutEntry = {
      id: genId(),
      date,
      templateId,
      templateName: selectedTemplate?.name,
      exercises: cleanExercises,
      notes: notes.trim() || undefined,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    setWorkouts((prev) => [entry, ...prev]);
    if (andLogAnother) {
      reset();
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } else {
      onDone();
    }
  }

  return (
    <div>
      {saved && <div className="toast">Workout saved ✓</div>}

      <div className="field">
        <label htmlFor="workout-date">Date</label>
        <input
          id="workout-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {templates.length > 0 && (
        <div className="field">
          <label>Quick-select a template</label>
          <div className="template-chip-row">
            {templates.map((t) => (
              <button
                type="button"
                key={t.id}
                className={`template-chip${templateId === t.id ? " selected" : ""}`}
                onClick={() => pickTemplate(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {warmup && (
        <div className="warmup-banner">
          <span className="pill pill-stretch">Warm-up</span>
          <h3 style={{ marginTop: "0.4rem" }}>{warmup.name}</h3>
          {warmup.description && <p style={{ margin: 0 }}>{warmup.description}</p>}
          <p className="muted" style={{ margin: "0.3rem 0 0" }}>
            {warmup.durationMinutes ? `${warmup.durationMinutes} min` : ""}
            {warmup.durationMinutes && warmup.muscleGroup ? " · " : ""}
            {warmup.muscleGroup ?? ""}
          </p>
        </div>
      )}

      <div className="field">
        <label>Exercises</label>
        <ExerciseEditor
          exercises={exercises}
          onChange={setExercises}
          weightUnit={settings.weightUnit}
        />
      </div>

      {exercises.length === 0 && (
        <button
          type="button"
          className="btn btn-sm"
          style={{ marginBottom: "0.9rem" }}
          onClick={() => setExercises([emptyExercise()])}
        >
          + Add exercise
        </button>
      )}

      <div className="field">
        <label htmlFor="workout-notes">Notes (optional)</label>
        <textarea
          id="workout-notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did it feel? Any PRs?"
        />
      </div>

      <div className="row" style={{ gap: "0.6rem" }}>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => save(false)}
        >
          Save workout
        </button>
      </div>
      <button
        type="button"
        className="btn btn-block"
        style={{ marginTop: "0.6rem" }}
        onClick={() => save(true)}
      >
        Save &amp; log another
      </button>
    </div>
  );
}
