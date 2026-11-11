import { FileText, Eye } from "lucide-react";
import { openDataUrl } from "../lib/blob";

export default function Documents({ items }) {
  if (items.length === 0) return null;

  return (
    <section id="documents" className="section">
      <div className="container">
        <h2 className="section-title">Documents</h2>
        <p className="section-sub">Other professional documents.</p>

        <div className="grid">
          {items.map((d) => (
            <div className="card lift" key={d.id}>
              {d.file && d.fileType === "image" ? (
                <img className="cert-preview" src={d.file} alt={d.title} loading="lazy" />
              ) : (
                <div className="cert-preview">
                  <FileText size={44} />
                </div>
              )}
              <h3 style={{ fontSize: "1.05rem" }}>{d.title}</h3>
              {d.description && (
                <p className="muted" style={{ marginBottom: 12 }}>{d.description}</p>
              )}
              {d.file && (
                <button className="btn btn-ghost" onClick={() => openDataUrl(d.file)}>
                  <Eye size={16} /> View Document
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}