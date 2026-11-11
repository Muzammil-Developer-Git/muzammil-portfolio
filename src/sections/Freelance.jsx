import { ExternalLink, Mail } from "lucide-react";

export default function Freelance({ services, skills, links }) {
  const upwork = links.find((l) => l.icon === "upwork" && l.url);
  if (services.length === 0 && !upwork) return null;

  const skillNames = [...new Set(skills.map((s) => s.name))].slice(0, 12);

  return (
    <section id="freelance" className="section">
      <div className="container">
        <h2 className="section-title">Freelance With Me</h2>
        <p className="section-sub">
          I am open to freelance projects and collaboration. Here is what I can help with.
        </p>

        {services.length > 0 && (
          <div className="grid" style={{ marginBottom: 24 }}>
            {services.map((s) => (
              <div className="card lift" key={s.id}>
                <h3 style={{ fontSize: "1.05rem", marginBottom: s.description ? 6 : 0 }}>
                  {s.title}
                </h3>
                {s.description && <p className="muted">{s.description}</p>}
              </div>
            ))}
          </div>
        )}

        {skillNames.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div className="t-label">Skills</div>
            <div className="chips">
              {skillNames.map((n) => (
                <span className="chip" key={n}>
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="row">
          {upwork && (
            <a className="btn btn-primary" href={upwork.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={18} /> View Upwork Profile
            </a>
          )}
          <a className="btn btn-ghost" href="#contact">
            <Mail size={18} /> Start a Project
          </a>
        </div>
      </div>
    </section>
  );
}