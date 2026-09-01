import { genId } from "./storage";

export interface EditableStretchItem {
  id: string;
  name: string;
  reps: number;
  durationSeconds: number;
}

export function emptyStretchItem(): EditableStretchItem {
  return { id: genId(), name: "", reps: 0, durationSeconds: 30 };
}

export function formatStretchAmount(item: {
  reps?: number;
  durationSeconds?: number;
}): string {
  const parts: string[] = [];
  if (item.reps) parts.push(`${item.reps} reps`);
  if (item.durationSeconds) {
    parts.push(
      item.durationSeconds >= 60
        ? `${Math.floor(item.durationSeconds / 60)}:${String(
            item.durationSeconds % 60,
          ).padStart(2, "0")} min`
        : `${item.durationSeconds} sec`,
    );
  }
  return parts.join(" · ");
}
