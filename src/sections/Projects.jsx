import { ExternalLink, Code, FolderKanban } from "lucide-react";
import { openDataUrl } from "../lib/blob";

const split = (t, sep) =>
  (t || "")
    .split(sep)
    .map((x) => x.trim())
    .filter(Boolean);

export default function Projects({ projects }) {
  if (projects.length === 0) return null;

  const sorted = [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-sub">Things I have built while learning and practising.</p>

        <div className="projects-grid">
          {sorted.map((p) => {
            const techs = split(p.technologies, ",");
            const features = split(p.features, "\n");
            const gallery = Array.isArray(p.gallery) ? p.gallery : [];
            return (
              <article key={p.id} className={"card project-card lift" + (p.featured ? " featured" : "")}>
                <div className="project-media">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={`${p.title} screenshot`}
                      loading="lazy"
                      onClick={() => openDataUrl(p.image)}
                    />
                  ) : (
                    <div className="project-placeholder">
                      <FolderKanban size={44} />
                    </div>
                  )}
                </div>

                <div className="project-body">
                  <div>
                    {p.badge && <span className="badge-accent">{p.badge}</span>}
                    {p.category && <div className="muted" style={{ fontSize: "0.85rem" }}>{p.category}</div>}
                  </div>
                  <h3>{p.title}</h3>
                  <p className="muted">{p.description}</p>

                  {features.length > 0 && (
                    <ul className="t-list">
                      {features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  )}

                  {techs.length > 0 && (
                    <div className="chips" style={{ marginTop: 0 }}>
                      {techs.map((t) => (
                        <span className="chip" key={t}>{t}</span>
                      ))}
                    </div>
                  )}

                  {gallery.length > 0 && (
                    <div className="gallery-row">
                      {gallery.map((g, i) => (
                        <img key={i} src={g} alt={`${p.title} gallery ${i + 1}`} loading="lazy" onClick={() => openDataUrl(g)} />
                      ))}
                    </div>
                  )}

                  {(p.liveUrl || p.githubUrl) && (
                    <div className="project-actions">
                      {p.liveUrl && (
                        <a className="btn btn-primary" href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={16} /> Live Website
                        </a>
                      )}
                      {p.githubUrl && (
                        <a className="btn btn-ghost" href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Code size={16} /> Source Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}