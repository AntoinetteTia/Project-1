import type { ViewId } from "../App";

const NAV_ITEMS: { id: ViewId; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "log", label: "Log", icon: "➕" },
  { id: "history", label: "History", icon: "☰" },
  { id: "bodyweight", label: "Weight", icon: "⚖" },
  { id: "templates", label: "Templates", icon: "⌘" },
  { id: "stretches", label: "Stretch", icon: "❤" },
];

export default function Nav({
  active,
  onChange,
}: {
  active: ViewId;
  onChange: (id: ViewId) => void;
}) {
  return (
    <nav className="app-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`nav-item${active === item.id ? " active" : ""}`}
          onClick={() => onChange(item.id)}
        >
          <span className="nav-icon" aria-hidden="true">
            {item.icon}
          </span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
