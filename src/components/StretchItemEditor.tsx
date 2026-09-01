import { emptyStretchItem, type EditableStretchItem } from "../lib/stretchItem";

export default function StretchItemEditor({
  items,
  onChange,
}: {
  items: EditableStretchItem[];
  onChange: (next: EditableStretchItem[]) => void;
}) {
  function update(id: string, patch: Partial<EditableStretchItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function remove(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function add() {
    onChange([...items, emptyStretchItem()]);
  }

  return (
    <div>
      {items.length > 0 && (
        <div
          className="stretch-item-row"
          style={{ marginBottom: "0.25rem" }}
          aria-hidden="true"
        >
          <span className="muted">Stretch / warm-up move</span>
          <span className="muted">Reps</span>
          <span className="muted">Sec</span>
          <span />
        </div>
      )}
      {items.map((item) => (
        <div className="stretch-item-row" key={item.id}>
          <input
            aria-label="Stretch name"
            placeholder="e.g. Arm circles"
            value={item.name}
            onChange={(e) => update(item.id, { name: e.target.value })}
          />
          <input
            aria-label="Reps"
            type="number"
            min={0}
            inputMode="numeric"
            value={item.reps || ""}
            placeholder="—"
            onChange={(e) => update(item.id, { reps: Number(e.target.value) })}
          />
          <input
            aria-label="Duration in seconds"
            type="number"
            min={0}
            inputMode="numeric"
            value={item.durationSeconds || ""}
            placeholder="—"
            onChange={(e) =>
              update(item.id, { durationSeconds: Number(e.target.value) })
            }
          />
          <button
            type="button"
            className="icon-btn"
            aria-label="Remove stretch"
            onClick={() => remove(item.id)}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-sm"
        style={{
          background: "var(--stretch-accent-soft)",
          color: "var(--stretch-accent)",
          borderColor: "transparent",
        }}
        onClick={add}
      >
        + Add stretch
      </button>
    </div>
  );
}
