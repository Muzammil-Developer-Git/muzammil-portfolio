import {
  Code, LayoutDashboard, Globe, Database, Server, Terminal,
  GitBranch, Wrench, Palette, Cpu,
} from "lucide-react";

const ICONS = {
  code: Code,
  layout: LayoutDashboard,
  globe: Globe,
  database: Database,
  server: Server,
  terminal: Terminal,
  git: GitBranch,
  wrench: Wrench,
  palette: Palette,
  cpu: Cpu,
};

export default function Skills({ skills }) {
  if (skills.length === 0) return null;

  const groups = [];
  skills.forEach((s) => {
    const cat = s.category || "Other";
    let g = groups.find((x) => x.name === cat);
    if (!g) {
      g = { name: cat, items: [] };
      groups.push(g);
    }
    g.items.push(s);
  });

  return (
    <section id="skills" className="section">
      <div className="container">
        <h2 className="section-title">Technical Skills</h2>
        <p className="section-sub">Technologies and tools I have worked with.</p>

        {groups.map((g) => (
          <div className="skill-group" key={g.name}>
            <h3>{g.name}</h3>
            <div className="grid">
              {g.items.map((s) => {
                const Icon = ICONS[s.icon] || Code;
                return (
                  <div className="card skill-card lift" key={s.id}>
                    <span className="skill-icon">
                      <Icon size={20} />
                    </span>
                    <div>
                      <div className="skill-name">{s.name}</div>
                      {s.description && <div className="skill-desc">{s.description}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}