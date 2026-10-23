import React, { useState } from "react";
import { Menu, X, ArrowUpRight, Upload } from "lucide-react";

export default function Header({ onOpenCandidateModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Industries", href: "#industries" },
    { name: "Our Process", href: "#process" },
    { name: "FAQs", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  const handleLinkClick = (e, href) => {
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <div className="topline"></div>
      <header className="nav">
        <div className="container navinner">
          <a
            aria-label="Oryenza home"
            className="brand"
            href="#home"
            onClick={(e) => handleLinkClick(e, "#home")}
          >
            <img
              alt="Oryenza Talent Services logo"
              src="/assets/oryenza_logo_clean.png"
              className="brand-logo"
              width="88"
              height="68"
            />
          </a>

          <nav aria-label="Main navigation" className="links">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="btn secondary nav-action-desktop"
              onClick={onOpenCandidateModal}
              title="Job Seekers: Submit your CV/Resume directly"
            >
              <Upload size={16} />
              <span>Submit CV</span>
            </button>

            <a
              className="btn primary nav-action-cta"
              href="#contact"
              onClick={(e) => handleLinkClick(e, "#contact")}
            >
              <span>Hire Talent</span>
              <ArrowUpRight size={16} />
            </a>

            <button
              aria-expanded={mobileMenuOpen}
              aria-label={
                mobileMenuOpen ? "Close navigation" : "Open navigation"
              }
              className="menu"
              id="menuBtn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              type="button"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <nav
          className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}
          id="mobileNav"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.name}
            </a>
          ))}
          <div className="mobile-actions">
            <button
              type="button"
              className="btn secondary"
              style={{ width: "100%" }}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCandidateModal();
              }}
            >
              <Upload size={16} />
              <span>Submit Resume / CV</span>
            </button>
            <a
              className="btn primary"
              href="#contact"
              style={{ width: "100%" }}
              onClick={(e) => handleLinkClick(e, "#contact")}
            >
              <span>Hire Talent</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </nav>
      </header>
    </>
  );
}
