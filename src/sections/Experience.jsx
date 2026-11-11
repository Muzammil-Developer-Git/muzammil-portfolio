import { Briefcase } from "lucide-react";

const lines = (t) =>
  (t || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

export default function Experience({ items }) {
  if (items.length === 0) return null;

  return (
    <section id="experience" className="section">
      <div className="container">
        <h2 className="section-title">Work Experience</h2>
        <p className="section-sub">Where I have worked.</p>

        <div className="timeline">
          {items.map((x) => {
            const resp = lines(x.responsibilities);
            const ach = lines(x.achievements);
            const dates = [x.startDate, x.endDate].filter(Boolean).join(" – ");
            return (
              <div className="card lift" key={x.id}>
                <div className="row" style={{ marginBottom: 6 }}>
                  <span className="skill-icon">
                    <Briefcase size={20} />
                  </span>
                  <h3 className="t-title" style={{ marginBottom: 0 }}>{x.position}</h3>
                </div>
                <div className="t-meta">
                  {[x.organization, x.type, dates].filter(Boolean).join(" · ")}
                </div>

                {resp.length > 0 && (
                  <>
                    <div className="t-label">Responsibilities</div>
                    <ul className="t-list">
                      {resp.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </>
                )}

                {ach.length > 0 && (
                  <>
                    <div className="t-label">Achievements</div>
                    <ul className="t-list">
                      {ach.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}