import BrandIcon from "./BrandIcon";

export default function Footer({ name, links }) {
  const shown = links.filter((l) => l.url);
  return (
    <footer className="footer">
      <div className="container">
        {shown.length > 0 && (
          <div className="social-row">
            {shown.map((l) => (
              <a
                key={l.id}
                href={l.url}
                title={l.name}
                aria-label={l.name}
                {...(l.url.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
              >
                <BrandIcon name={l.icon} small />
              </a>
            ))}
          </div>
        )}
        <p className="muted">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}