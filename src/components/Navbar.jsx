import { useState } from "react";
import "./navbar.css";

export default function Navbar({ profile = {} }) {
  const [open, setOpen] = useState(false);

  const links = [
    ["About", "#about"],
    ["Skills", "#skills"],
    ["Projects", "#projects"],
    ["Experience", "#experience"],
    ["Contact", "#contact"],
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#home" className="navbar-logo">
          {profile.logo || "RN."}
        </a>

        <nav className={`navbar-links ${open ? "open" : ""}`}>
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="navbar-button"
        >
          Let's Talk
        </a>

        <button
          className="navbar-menu"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}