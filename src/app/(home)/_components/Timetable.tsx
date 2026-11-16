import type { V2Home } from "@/lib/content/schema";
import { cta } from "../_lib/track";
import { Label } from "./Label";
import { Reveal } from "./Reveal";
import { TimetableTabs } from "./TimetableTabs";

type Content = V2Home["timetable"];
type Schedule = Content["schedules"][number];

/** "6:15 AM" → 6:15 with a small "AM". */
function Time({ value }: { value: string }) {
  const [clock, suffix] = value.split(" ");
  return (
    <>
      {clock}
      {suffix && <small> {suffix}</small>}
    </>
  );
}

function Pill({ schedule, k }: { schedule: Schedule; k: string }) {
  const c = schedule.classes.find((x) => x.key === k)!;
  return <span className={`v2-tt__pill v2-tt__pill--${c.style}`}>{c.name}</span>;
}

function Panel({ schedule, content }: { schedule: Schedule; content: Content }) {
  return (
    <>
      <h3 className="v2-tt__title">
        {schedule.title} <em>{schedule.titleAccent}</em>
      </h3>

      {/* tablets and up: the week as a grid */}
      <div className="v2-tt__gridwrap">
        <table className="v2-tt__grid">
          <caption className="v2-sr">{schedule.tab}</caption>
          <thead>
            <tr>
              <td />
              {content.days.map((d, i) => (
                <th key={d} scope="col" abbr={content.dayNames[i]}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.rows.map((r) => (
              <tr key={r.time}>
                <th scope="row">
                  <Time value={r.time} />
                </th>
                {r.slots.map((k, i) => (
                  <td key={content.days[i]}>
                    {k ? (
                      <Pill schedule={schedule} k={k} />
                    ) : (
                      <span className="v2-tt__dot">
                        <span className="v2-sr">{content.emptyLabel}</span>
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* phones: one block per day, only the classes that run */}
      <ul className="v2-tt__days">
        {content.days.map((d, i) => {
          const sessions = schedule.rows.filter((r) => r.slots[i]);
          if (sessions.length === 0) return null;
          return (
            <li key={d} className="v2-tt__day">
              <h4>{content.dayNames[i]}</h4>
              <ul>
                {sessions.map((r) => (
                  <li key={r.time}>
                    <span className="v2-tt__time">
                      <Time value={r.time} />
                    </span>
                    <Pill schedule={schedule} k={r.slots[i]!} />
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      <ul className="v2-tt__legend">
        {schedule.classes.map((c) => (
          <li key={c.key}>
            <span className={`v2-tt__swatch v2-tt__pill--${c.style}`} aria-hidden />
            <span>
              <b>{c.legend}</b>
              {c.detail}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function Timetable({ n, content }: { n: number; content: Content }) {
  return (
    <section id="timetable" className="v2-section v2-tt" aria-labelledby="v2-tt-title">
      <div className="v2-container">
        <div className="v2-rhead">
          <Reveal>
            <Label n={n}>{content.label}</Label>
            <h2 id="v2-tt-title" className="v2-h2">
              {content.heading}
            </h2>
          </Reveal>
          <Reveal index={1} className="v2-rhead__r">
            <p className="v2-body">{content.body}</p>
            <a href={content.book.href} className="v2-tlink" {...cta("book_class", "timetable")}>
              {content.book.label} <span aria-hidden>→</span>
            </a>
          </Reveal>
        </div>
        <TimetableTabs
          label={content.tabsLabel}
          tabs={content.schedules.map((s) => ({ id: s.id, label: s.tab }))}
        >
          {content.schedules.map((s) => (
            <Panel key={s.id} schedule={s} content={content} />
          ))}
        </TimetableTabs>
      </div>
    </section>
  );
}
