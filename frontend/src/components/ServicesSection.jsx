import React from "react";
import { ArrowRight } from "lucide-react";

export default function ServicesSection({ onSelectRequirement }) {
  const handleServiceClick = (requirementName) => {
    if (onSelectRequirement) {
      onSelectRequirement(requirementName);
    }
    const contactElem = document.querySelector("#contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const services = [
    {
      icon: "◎",
      title: "Permanent Recruitment",
      desc: "Find dedicated professionals whose skills, leadership style, and career ambitions align seamlessly with your core roles and long-term business goals.",
      ctaText: "Discuss a role",
      reqValue: "Permanent recruitment",
      isFeature: false,
    },
    {
      icon: "⌁",
      title: "Contract & Project Hiring",
      desc: "Assemble agile, high-capability teams for mission-critical projects, seasonal surges, and specialized tech sprints with zero payroll overhead.",
      ctaText: "Explore flexible hiring",
      reqValue: "Contract / project hiring",
      isFeature: true,
    },
    {
      icon: "◇",
      title: "Talent Sourcing & Screening",
      desc: "Accelerate your pipeline with extensive talent mapping, behavioral evaluations, technical competency checks, and pre-interview qualification.",
      ctaText: "Strengthen your pipeline",
      reqValue: "Talent sourcing & screening",
      isFeature: false,
    },
  ];

  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head">
          <div className="kicker">What we do</div>
          <h2>Recruitment that fits the way you hire.</h2>
          <p>
            From an executive specialist position to volume hiring across
            operations, we emphasize uncompromising qualification, curated
            shortlists, and a friction-free recruitment journey.
          </p>
        </div>

        <div className="grid3">
          {services.map((svc, idx) => (
            <article
              key={idx}
              className={`card ${svc.isFeature ? "feature-card" : ""}`}
            >
              <div className="card-content">
                <div className="iconbox">{svc.icon}</div>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
              </div>
              <button
                type="button"
                className="textlink"
                onClick={() => handleServiceClick(svc.reqValue)}
              >
                <span>{svc.ctaText}</span>
                <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
