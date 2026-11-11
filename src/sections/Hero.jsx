import { User, Mail, FolderKanban } from "lucide-react";
import BrandIcon from "../components/BrandIcon";
import { DownloadCvButton } from "../components/CvActions";

export default function Hero({ profile, photo, links, hasProjects, cvInfo }) {
  const social = ["linkedin", "github"]
    .map((k) => links.find((l) => l.icon === k && l.url))
    .filter(Boolean);

  return (
    <section id="home" className="hero">
      <div className="container hero-inner">
        <div>
          <div className="hero-eyebrow">Hello, I am</div>
          <h1 className="gradient-text">{profile.fullName}</h1>
          <p className="hero-headline">{profile.headline}</p>
          {profile.intro && <p className="hero-intro">{profile.intro}</p>}

          <div className="hero-actions">
            {hasProjects && (
              <a href="#projects" className="btn btn-primary">
                <FolderKanban size={18} /> View My Projects
              </a>
            )}
            {cvInfo && <DownloadCvButton info={cvInfo} className="btn btn-ghost" />}
            <a href="#contact" className="btn btn-ghost">
              <Mail size={18} /> Contact Me
            </a>
          </div>

          {social.length > 0 && (
            <div className="social-row">
              {social.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={l.name}
                  aria-label={l.name}
                >
                  <BrandIcon name={l.icon} small />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="hero-photo">
          {photo ? (
            <img className="hero-avatar" src={photo} alt={profile.fullName} />
          ) : (
            <div className="hero-avatar">
              <User size={96} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}