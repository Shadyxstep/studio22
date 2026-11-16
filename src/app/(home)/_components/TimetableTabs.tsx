"use client";

import { Children, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/*
 * ARIA tabs over the timetable panels. Before hydration (and with JS off)
 * every panel renders, so the full timetable is always readable; once
 * mounted only the active panel shows.
 */
export function TimetableTabs({
  label,
  tabs,
  children,
}: {
  label: string;
  tabs: { id: string; label: string }[];
  children: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => setMounted(true), []);

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const panels = Children.toArray(children);
  return (
    <div className="v2-tt__tabs">
      <div role="tablist" aria-label={label} className="v2-tt__tablist" onKeyDown={onKey}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tt-tab-${t.id}`}
            aria-controls={`tt-panel-${t.id}`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            className="v2-tt__tab"
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`tt-panel-${t.id}`}
          aria-labelledby={`tt-tab-${t.id}`}
          className="v2-tt__panel"
          hidden={mounted && i !== active}
        >
          {panels[i]}
        </div>
      ))}
    </div>
  );
}
