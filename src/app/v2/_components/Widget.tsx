import type { V2WidgetType } from "@/lib/content/schema";

/* The small decorative panel at the foot of each offering card. Its text is
   repeated from content, so the whole panel is hidden from assistive tech. */
export function Widget({ widget }: { widget: V2WidgetType }) {
  switch (widget.kind) {
    case "programme":
      return (
        <div className="v2-mock" aria-hidden>
          <div className="v2-mock__h">
            <strong>{widget.title}</strong>
            <span className="v2-mock__live">
              <span className="v2-dot" />
              {widget.badge}
            </span>
          </div>
          <div className="v2-weeks">
            {widget.weeks.map((w) => (
              <div key={w} className="v2-wk">
                <i />
                {w}
              </div>
            ))}
          </div>
          <div className="v2-phase">
            {widget.phases.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
          <div className="v2-mock__f">{widget.footnote}</div>
        </div>
      );
    case "golf":
      return (
        <div className="v2-mock" aria-hidden>
          <div className="v2-mock__h">
            <strong>{widget.title}</strong>
            <span className="v2-mock__live">
              <span className="v2-dot" />
              {widget.badge}
            </span>
          </div>
          <div className="v2-golf">
            <svg viewBox="0 0 240 52" preserveAspectRatio="none" fill="none" overflow="visible">
              <defs>
                <linearGradient id="v2-arcg" x1="0" x2="1">
                  <stop offset="0" stopColor="var(--accent-lo)" />
                  <stop offset="1" stopColor="var(--accent-hi)" />
                </linearGradient>
              </defs>
              <path d="M4 48H236" stroke="var(--line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <path d="M4 48H236" stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 6" vectorEffect="non-scaling-stroke" />
              <path className="v2-arc" d="M16 47 Q 104 -14 200 44" stroke="url(#v2-arcg)" strokeWidth="1.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <g className="v2-land">
                <ellipse cx="202" cy="44" rx="20" ry="4.5" stroke="var(--accent-lo)" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="rgba(178,172,136,.08)" />
                {[190, 198, 203, 209, 214].map((cx, i) => (
                  <circle key={cx} cx={cx} cy={[44, 42.5, 45, 43, 45][i]} r="1.3" fill={i === 2 ? "var(--accent-hi)" : "var(--accent)"} />
                ))}
              </g>
              <circle cx="16" cy="47" r="1.8" fill="var(--text)" />
            </svg>
          </div>
          <div className="v2-chips">
            {widget.chips.map((c, i) => (
              <span key={c} className={`v2-chip ${i === 0 ? "v2-chip--acc" : ""}`}>
                {c}
              </span>
            ))}
          </div>
          <div className="v2-mock__f">{widget.footnote}</div>
        </div>
      );
    case "classes":
      return (
        <div className="v2-mock" aria-hidden>
          <div className="v2-mock__h">
            <strong>{widget.title}</strong>
            <span className="v2-chip">{widget.badge}</span>
          </div>
          <ul className="v2-rows">
            {widget.classes.map((c) => (
              <li key={c}>
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <div className="v2-mock__f">{widget.footnote}</div>
        </div>
      );
    case "checks":
      return (
        <div className="v2-mock" aria-hidden>
          <div className="v2-mock__h">
            <strong>{widget.title}</strong>
            <span className="v2-chip v2-chip--acc">{widget.badge}</span>
          </div>
          <div className="v2-warm" />
          <ul className="v2-checks">
            {widget.items.map((item) => (
              <li key={item}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--accent)" strokeWidth="1.2">
                  <path d="m2 6.3 2.6 2.6L10 3.3" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
  }
}
