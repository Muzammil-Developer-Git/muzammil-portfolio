import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ name, items }) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#home" className="nav-brand">
          {name}
        </a>

        <nav className={"nav-links" + (open ? " open" : "")} aria-label="Main navigation">
          {items.map((i) => (
            <a key={i.id} href={`#${i.id}`} onClick={() => setOpen(false)}>
              {i.label}
            </a>
          ))}
        </nav>

        <div className="nav-tools">
          <button className="icon-btn" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="icon-btn nav-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}