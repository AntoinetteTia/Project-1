export interface ExerciseSet {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface WorkoutEntry {
  id: string;
  date: string; // YYYY-MM-DD
  templateId?: string;
  templateName?: string;
  exercises: ExerciseSet[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BodyWeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: TemplateExercise[];
  stretchRoutineId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StretchItem {
  id: string;
  name: string;
  reps?: number;
  durationSeconds?: number;
}

export interface StretchRoutine {
  id: string;
  name: string;
  description?: string;
  muscleGroup?: string;
  items: StretchItem[];
  createdAt: string;
  updatedAt: string;
}

export type WeightUnit = "lb" | "kg";

export interface Settings {
  weightUnit: WeightUnit;
}

export interface AppData {
  workouts: WorkoutEntry[];
  bodyWeights: BodyWeightEntry[];
  templates: WorkoutTemplate[];
  stretches: StretchRoutine[];
  settings: Settings;
}
