import { GraduationCap } from "lucide-react";

export default function Education({ items }) {
  if (items.length === 0) return null;

  return (
    <section id="education" className="section alt">
      <div className="container">
        <h2 className="section-title">Education</h2>
        <p className="section-sub">My academic background.</p>

        <div className="timeline">
          {items.map((e) => (
            <div className="card lift" key={e.id}>
              <div className="row" style={{ marginBottom: 6 }}>
                <span className="skill-icon">
                  <GraduationCap size={20} />
                </span>
                <h3 className="t-title" style={{ marginBottom: 0 }}>{e.degree}</h3>
              </div>
              <div className="t-meta">
                {[e.institution, e.session && `Session ${e.session}`, e.graduationYear && `Graduated ${e.graduationYear}`]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
              {e.details && <p>{e.details}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}