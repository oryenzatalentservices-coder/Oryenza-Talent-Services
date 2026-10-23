import React, { useState } from "react";
import {
  ChevronRight,
  Layers,
  Users,
  Search,
  MessageSquare,
  Award,
  CheckCircle2,
} from "lucide-react";

export default function ProcessSection() {
  const [selectedStage, setSelectedStage] = useState(0);

  const stages = [
    {
      num: "01",
      title: "Requirement Intake",
      icon: <Layers size={22} />,
      tagline: "Understanding role context, team dynamics & success criteria",
      details:
        "We meet with department heads and hiring managers to map technical requirements, cultural non-negotiables, reporting structures, compensation benchmarks, and long-term deliverables.",
      deliverables: [
        "Detailed mandate briefing & role calibration",
        "Compensation & market benchmark analysis",
        "Target candidate persona profile definition",
      ],
    },
    {
      num: "02",
      title: "Active Sourcing",
      icon: <Search size={22} />,
      tagline:
        "Targeted headhunting & talent pool mapping across India and beyond",
      details:
        "Our specialized recruiters leverage proprietary industry databases, direct outbound headhunting, and trusted executive networks to engage both high-performing active candidates and discreet passive talent.",
      deliverables: [
        "Comprehensive industry talent pool mapping",
        "Confidential multi-channel headhunting outreach",
        "Initial competency qualification & interest validation",
      ],
    },
    {
      num: "03",
      title: "Contextual Screening",
      icon: <Users size={22} />,
      tagline: "Rigorous behavioral & technical competency validation",
      details:
        "Every candidate undergoes a multi-dimensional vetting process checking verified career achievements, skill proficiencies, stability patterns, cultural alignment, and authentic career motivations.",
      deliverables: [
        "Structured competency & behavioral interviews",
        "Notice period & compensation compatibility check",
        "Curated shortlist with recruiter assessment notes",
      ],
    },
    {
      num: "04",
      title: "Interview Loop",
      icon: <MessageSquare size={22} />,
      tagline:
        "Seamless coordination, feedback synthesis & expectation management",
      details:
        "We coordinate end-to-end interview schedules, prepare candidates on role expectations, and collect immediate bilateral feedback after each round to keep candidate engagement high.",
      deliverables: [
        "Calendar management & seamless loop scheduling",
        "Real-time candidate feedback & sentiment check",
        "Transparent bilateral communication throughout",
      ],
    },
    {
      num: "05",
      title: "Offer & Onboarding",
      icon: <Award size={22} />,
      tagline: "Negotiation facilitation, reference checks & smooth joining",
      details:
        "We assist with offer delivery, notice period management, counter-offer mitigation, and candidate check-ins up through their 90-day milestone to guarantee long-term retention.",
      deliverables: [
        "Professional offer negotiation facilitation",
        "Rigorous background & credential checks",
        "Continuous engagement through joining & first 90 days",
      ],
    },
  ];

  return (
    <section className="section pale-section" id="process">
      <div className="container">
        <div className="section-head">
          <div className="kicker">How We Work</div>
          <h2>Connecting the right talent to the right opportunity.</h2>
          <p>
            A structured, predictable 5-stage recruitment journey from initial
            intake to successful joining.
          </p>
        </div>

        {/* 5-Stage Recruitment Journey Logo Animation Showcase */}
        <div className="oryenza-final-process">
          <div className="process-iframe-container">
            <iframe
              allow="autoplay"
              loading="eager"
              src="/assets/process_journey.html"
              style={{ background: "transparent" }}
              title="Oryenza 5-stage recruitment process journey animation"
            />
          </div>
        </div>

        {/* 5-Stage Interactive Tabs Grid */}
        <div
          className="process-steps-grid"
          role="tablist"
          aria-label="Recruitment Stages"
        >
          {stages.map((stage, idx) => {
            const isActive = selectedStage === idx;
            return (
              <button
                type="button"
                key={stage.num}
                role="tab"
                aria-selected={isActive}
                className={`process-step-card ${isActive ? "active-step" : ""}`}
                onClick={() => setSelectedStage(idx)}
              >
                <div className="process-step-num">{stage.num}</div>
                <div className="process-card-title-wrap">
                  <span className="process-step-sublabel">
                    Stage {stage.num}
                  </span>
                  <h3 className="process-step-name">{stage.title}</h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Stage Highlight Card */}
        <div className="process-highlight-card">
          <div className="process-highlight-main">
            <div className="process-highlight-badge">
              <span className="process-highlight-icon">
                {stages[selectedStage].icon}
              </span>
              <span className="process-highlight-number">
                Stage {stages[selectedStage].num} of 05
              </span>
            </div>

            <h3 className="process-highlight-title">
              {stages[selectedStage].title}
            </h3>

            <p className="process-highlight-tagline">
              {stages[selectedStage].tagline}
            </p>

            <p className="process-highlight-details">
              {stages[selectedStage].details}
            </p>

            {/* Deliverables Checklist */}
            <div className="process-deliverables-title">
              Key Mandate Milestones:
            </div>
            <div className="process-deliverables-grid">
              {stages[selectedStage].deliverables.map((item, dIdx) => (
                <div key={dIdx} className="process-deliverable-item">
                  <CheckCircle2
                    size={16}
                    className="process-deliverable-check"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="process-highlight-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() =>
                setSelectedStage((prev) => (prev + 1) % stages.length)
              }
            >
              <span>
                {selectedStage === stages.length - 1
                  ? "Back to Start (Stage 01)"
                  : "Next Stage"}
              </span>
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
