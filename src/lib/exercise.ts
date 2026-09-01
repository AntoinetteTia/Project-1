import { genId } from "./storage";

export interface EditableExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export function emptyExercise(): EditableExercise {
  return { id: genId(), name: "", sets: 3, reps: 10, weight: 0 };
}
