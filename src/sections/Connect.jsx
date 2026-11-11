import { ExternalLink } from "lucide-react";
import BrandIcon from "../components/BrandIcon";

export default function Connect({ links }) {
  const shown = links.filter((l) => l.url);
  if (shown.length === 0) return null;

  return (
    <section id="connect" className="section alt">
      <div className="container">
        <h2 className="section-title">Connect With Me</h2>
        <p className="section-sub">Find me on these professional platforms.</p>

        <div className="grid">
          {shown.map((l) => {
            const isMail = l.url.startsWith("mailto:");
            return (
              <div className="card link-card lift" key={l.id}>
                <div className="link-top">
                  <BrandIcon name={l.icon} />
                  {l.name}
                </div>
                <a
                  className="btn btn-ghost"
                  href={l.url}
                  {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <ExternalLink size={16} /> {isMail ? "Send Email" : "Open Profile"}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}