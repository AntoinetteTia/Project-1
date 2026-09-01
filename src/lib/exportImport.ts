import type { AppData } from "./types";

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportJson(data: AppData) {
  const stamp = new Date().toISOString().slice(0, 10);
  downloadFile(
    `workout-tracker-backup-${stamp}.json`,
    JSON.stringify(data, null, 2),
    "application/json",
  );
}

function csvEscape(value: unknown): string {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows: (string | number)[][]): string {
  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}

export function exportCsv(data: AppData) {
  const stamp = new Date().toISOString().slice(0, 10);

  const workoutRows: (string | number)[][] = [
    ["date", "template", "exercise", "sets", "reps", "weight", "notes"],
  ];
  for (const w of data.workouts) {
    if (w.exercises.length === 0) {
      workoutRows.push([w.date, w.templateName ?? "", "", "", "", "", w.notes ?? ""]);
      continue;
    }
    for (const ex of w.exercises) {
      workoutRows.push([
        w.date,
        w.templateName ?? "",
        ex.name,
        ex.sets,
        ex.reps,
        ex.weight,
        w.notes ?? "",
      ]);
    }
  }
  downloadFile(
    `workouts-${stamp}.csv`,
    toCsv(workoutRows),
    "text/csv",
  );

  const bwRows: (string | number)[][] = [["date", "weight"]];
  for (const b of data.bodyWeights) {
    bwRows.push([b.date, b.weight]);
  }
  downloadFile(
    `body-weight-${stamp}.csv`,
    toCsv(bwRows),
    "text/csv",
  );
}

export function parseImportedJson(text: string): Partial<AppData> {
  const parsed = JSON.parse(text);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Invalid backup file: expected a JSON object.");
  }
  return parsed as Partial<AppData>;
}
