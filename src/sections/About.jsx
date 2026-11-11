export default function About({ profile }) {
  const extras = [
    ["Career Objective", profile.objective],
    ["Career Goals", profile.goals],
    ["Interests", profile.interests],
    ["More About Me", profile.bio],
  ].filter(([, v]) => v);

  if (!profile.about && extras.length === 0) return null;

  return (
    <section id="about" className="section alt">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <p className="section-sub">A little about who I am and what I am looking for.</p>

        {profile.about && <p className="about-text">{profile.about}</p>}

        {extras.length > 0 && (
          <div className="grid">
            {extras.map(([title, text]) => (
              <div className="card about-extra" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}