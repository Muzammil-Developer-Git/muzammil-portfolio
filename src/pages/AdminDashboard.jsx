import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, User, Camera, FileText, Code, GraduationCap, Briefcase,
  FolderKanban, FolderOpen, Award, Share2, Globe, FileDown, Mail, Settings,
  LogOut, ExternalLink, Menu, Sun, Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ProfileFormManager from "../admin/ProfileFormManager";
import PhotoManager from "../admin/PhotoManager";
import CrudManager from "../admin/CrudManager";
import CvManager from "../admin/CvManager";
import MessagesManager from "../admin/MessagesManager";
import { CRUD_CONFIGS } from "../admin/crudConfigs";
import { PROFILE_FIELDS, ABOUT_FIELDS, SETTINGS_FIELDS } from "../admin/fieldConfigs";
import { DEFAULT_SETTINGS } from "../lib/defaults";

const MODULES = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile Information", icon: User },
  { id: "photo", label: "Profile Photo", icon: Camera },
  { id: "about", label: "About Me", icon: FileText },
  { id: "skills", label: "Skills", icon: Code },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Work Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "documents", label: "Other Documents", icon: FolderOpen },
  { id: "links", label: "Social Media Links", icon: Share2 },
  { id: "freelance", label: "Freelancing Profiles", icon: Globe },
  { id: "cv", label: "CV / Resume", icon: FileDown },
  { id: "messages", label: "Contact Messages", icon: Mail },
  { id: "settings", label: "Website Settings", icon: Settings },
];

function renderModule(id, label, email) {
  switch (id) {
    case "overview":
      return (
        <div className="card">
          <h2 style={{ marginBottom: 8 }}>Welcome</h2>
          <p className="muted" style={{ marginBottom: 14 }}>
            Logged in as {email}
          </p>
          <p>
            Use the menu on the left to manage your profile, skills, projects,
            certificates, CV and messages. Changes appear on your public
            website as soon as you save them.
          </p>
        </div>
      );
    case "profile":
      return <ProfileFormManager key="profile" fields={PROFILE_FIELDS} />;
    case "about":
      return <ProfileFormManager key="about" fields={ABOUT_FIELDS} />;
    case "photo":
      return <PhotoManager />;
    case "cv":
      return <CvManager />;
    case "messages":
      return <MessagesManager />;
    case "settings":
      return (
        <ProfileFormManager
          key="settings"
          col="settings"
          defaults={DEFAULT_SETTINGS}
          fields={SETTINGS_FIELDS}
        />
      );
    default:
      if (CRUD_CONFIGS[id]) {
        return <CrudManager key={id} config={CRUD_CONFIGS[id]} />;
      }
      return (
        <div className="card">
          <p className="muted">The "{label}" manager is not available.</p>
        </div>
      );
  }
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [active, setActive] = useState("overview");
  const [open, setOpen] = useState(false);

  const current = MODULES.find((m) => m.id === active);

  const choose = (id) => {
    setActive(id);
    setOpen(false);
  };

  return (
    <div className="admin">
      <aside className={"sidebar" + (open ? " open" : "")}>
        <div className="side-brand">Portfolio Admin</div>
        {MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              className={"side-link" + (active === m.id ? " active" : "")}
              onClick={() => choose(m.id)}
            >
              <Icon size={18} /> {m.label}
            </button>
          );
        })}
      </aside>

      <main className="admin-main">
        <div className="admin-top">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn btn-ghost menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
              <Menu size={18} />
            </button>
            <h1 style={{ fontSize: "1.6rem" }}>{current.label}</h1>
          </div>
          <div className="admin-actions">
            <button className="btn btn-ghost" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/" target="_blank" className="btn btn-ghost">
              <ExternalLink size={18} /> Preview Website
            </Link>
            <button className="btn btn-danger" onClick={logout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {renderModule(active, current.label, user?.email)}
      </main>
    </div>
  );
}