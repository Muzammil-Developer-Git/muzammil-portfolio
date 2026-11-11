import { Award, FileText, ExternalLink, Eye } from "lucide-react";
import { openDataUrl } from "../lib/blob";

export default function Certificates({ items }) {
  return (
    <section id="certifications" className="section alt">
      <div className="container">
        <h2 className="section-title">Certifications</h2>
        <p className="section-sub">Certificates and achievements.</p>

        {items.length === 0 ? (
          <div className="card empty-state">
            <Award size={36} style={{ color: "var(--muted)", marginBottom: 10 }} />
            <p className="muted">Certificates will be added here soon.</p>
          </div>
        ) : (
          <div className="grid">
            {items.map((c) => (
              <div className="card lift" key={c.id}>
                {c.file && c.fileType === "image" ? (
                  <img className="cert-preview" src={c.file} alt={c.title} loading="lazy" />
                ) : (
                  <div className="cert-preview">
                    {c.file ? <FileText size={44} /> : <Award size={44} />}
                  </div>
                )}
                <h3 style={{ fontSize: "1.05rem" }}>{c.title}</h3>
                <p className="muted" style={{ marginBottom: 12 }}>
                  {[c.issuer, c.issueDate].filter(Boolean).join(" · ")}
                </p>
                <div className="row">
                  {c.file && (
                    <button className="btn btn-ghost" onClick={() => openDataUrl(c.file)}>
                      <Eye size={16} /> View Certificate
                    </button>
                  )}
                  {c.credentialUrl && (
                    <a className="btn btn-ghost" href={c.credentialUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} /> Verify
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}