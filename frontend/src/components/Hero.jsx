import React from "react";
import { ArrowUpRight, ArrowDown, UserCheck, Rocket } from "lucide-react";
import HeroOrbit from "./HeroOrbit";

export default function Hero({
  onOpenCandidateModal,
  onOpenResumeAts,
  onOpenAnalyzeCv,
  onOpenAtsScore,
}) {
  const handleOpenAiSuite = onOpenResumeAts || onOpenAnalyzeCv || onOpenAtsScore;

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const elem = document.querySelector(targetId);
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-layout">
          <div className="hero-content">
            <div className="eyebrow">
              Recruitment built around your business
            </div>
            <h1>
              Win With the <span>Right Hire.</span>
            </h1>
            <p className="hero-copy">
              The right people move businesses forward. Oryenza Talent Services
              connects employers with relevant, carefully screened talent across
              industries - with a recruitment approach shaped around your real
              requirements.
            </p>

            <div className="hero-actions">
              <a
                className="btn primary"
                href="#contact"
                onClick={(e) => handleScroll(e, "#contact")}
              >
                <span>Let’s discuss your hiring</span>
                <ArrowUpRight size={18} />
              </a>
              <a
                className="btn secondary"
                href="#services"
                onClick={(e) => handleScroll(e, "#services")}
              >
                <span>Explore our services</span>
                <ArrowDown size={17} />
              </a>
              <button
                type="button"
                className="btn secondary hero-candidate-btn"
                onClick={onOpenCandidateModal}
              >
                <UserCheck size={17} className="hero-candidate-icon" />
                <span>Apply as Candidate</span>
              </button>
              <button
                type="button"
                className="btn hero-ai-btn"
                onClick={handleOpenAiSuite}
                title="Upload resume to evaluate quality and check ATS compatibility score"
              >
                <Rocket size={17} className="hero-ai-btn-icon" />
                <span>Analyze CV & Check ATS Score</span>
              </button>
            </div>

            <div className="hero-bottom">
              <div className="avatars">
                <span>IT</span>
                <span>M</span>
                <span>B</span>
                <span>+</span>
              </div>
              <span>One talent partner. Multiple industries across India.</span>
            </div>
          </div>

          <div className="hero-visual-orbit">
            <HeroOrbit />
          </div>
        </div>
      </div>
    </section>
  );
}
