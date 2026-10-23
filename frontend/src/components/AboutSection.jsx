import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function AboutSection() {
  const handleScroll = (e) => {
    e.preventDefault();
    const elem = document.querySelector("#contact");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  const checklistItems = [
    "Role-focused candidate sourcing and rigorous vetting",
    "Clear, transparent communication throughout the hiring lifecycle",
    "Pan-India recruitment capability across technical and corporate domains",
    "Human-centered, collaborative approach for both employers and job seekers",
  ];

  return (
    <section className="section" id="about">
      <div className="container split">
        <div className="visual-card">
          <div className="visual-card-logo-wrap">
            <img
              alt="Original Oryenza brand symbol"
              src="/assets/brand_symbol.png"
              loading="lazy"
            />
          </div>
          <div className="quote">
            "The right connection can change what a business achieves next."
          </div>
        </div>

        <div>
          <div className="kicker">About Oryenza</div>
          <h2>People are more than a résumé.</h2>
          <p>
            Oryenza Talent Services is a recruitment consultancy headquartered
            in Surat, Gujarat, supporting high-impact hiring across India. We
            delve deep to understand the organization's culture, the operational
            challenges, and the business goals before initiating candidate
            searches.
          </p>

          <ul className="checklist">
            {checklistItems.map((item, idx) => (
              <li key={idx}>
                <span className="check-icon">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <a className="btn primary" href="#contact" onClick={handleScroll}>
            <span>Work with Oryenza</span>
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
