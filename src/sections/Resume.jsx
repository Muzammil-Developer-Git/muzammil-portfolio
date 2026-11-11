import { FileText } from "lucide-react";
import { DownloadCvButton, ViewCvButton } from "../components/CvActions";

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "";

export default function Resume({ info }) {
  if (!info) return null;

  return (
    <section id="resume" className="section">
      <div className="container">
        <h2 className="section-title">CV / Resume</h2>
        <p className="section-sub">Download my latest CV or open it in your browser.</p>

        <div className="card" style={{ maxWidth: 560 }}>
          <div className="row" style={{ marginBottom: 16 }}>
            <span className="skill-icon">
              <FileText size={20} />
            </span>
            <div>
              <div className="item-title">{info.fileName}</div>
              {info.uploadedAt && <div className="item-sub">Updated {fmtDate(info.uploadedAt)}</div>}
            </div>
          </div>
          <div className="row">
            <DownloadCvButton info={info} />
            <ViewCvButton />
          </div>
        </div>
      </div>
    </section>
  );
}