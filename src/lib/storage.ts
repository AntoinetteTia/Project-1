import { useCallback, useEffect, useState } from "react";
import type {
  AppData,
  BodyWeightEntry,
  Settings,
  StretchRoutine,
  WorkoutEntry,
  WorkoutTemplate,
} from "./types";

const KEYS = {
  workouts: "workoutTracker.workouts",
  bodyWeights: "workoutTracker.bodyWeights",
  templates: "workoutTracker.templates",
  stretches: "workoutTracker.stretches",
  settings: "workoutTracker.settings",
} as const;

const DEFAULT_SETTINGS: Settings = { weightUnit: "lb" };

function readKey<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeKey<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to persist ${key}`, err);
  }
}

export function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function todayStr(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readKey<T>(key, fallback));

  useEffect(() => {
    writeKey(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

export function useAppData() {
  const [workouts, setWorkouts] = usePersistentState<WorkoutEntry[]>(
    KEYS.workouts,
    [],
  );
  const [bodyWeights, setBodyWeights] = usePersistentState<
    BodyWeightEntry[]
  >(KEYS.bodyWeights, []);
  const [templates, setTemplates] = usePersistentState<WorkoutTemplate[]>(
    KEYS.templates,
    [],
  );
  const [stretches, setStretches] = usePersistentState<StretchRoutine[]>(
    KEYS.stretches,
    [],
  );
  const [settings, setSettings] = usePersistentState<Settings>(
    KEYS.settings,
    DEFAULT_SETTINGS,
  );

  const exportData = useCallback((): AppData => {
    return { workouts, bodyWeights, templates, stretches, settings };
  }, [workouts, bodyWeights, templates, stretches, settings]);

  const importData = useCallback((data: Partial<AppData>) => {
    if (Array.isArray(data.workouts)) setWorkouts(data.workouts);
    if (Array.isArray(data.bodyWeights)) setBodyWeights(data.bodyWeights);
    if (Array.isArray(data.templates)) setTemplates(data.templates);
    if (Array.isArray(data.stretches)) setStretches(data.stretches);
    if (data.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
  }, [setWorkouts, setBodyWeights, setTemplates, setStretches, setSettings]);

  return {
    workouts,
    setWorkouts,
    bodyWeights,
    setBodyWeights,
    templates,
    setTemplates,
    stretches,
    setStretches,
    settings,
    setSettings,
    exportData,
    importData,
  };
}

export type AppDataApi = ReturnType<typeof useAppData>;
