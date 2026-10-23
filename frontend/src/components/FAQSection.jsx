import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function FAQSection({ onOpenCandidateModal }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What recruitment services does Oryenza offer?",
      a: "We provide comprehensive talent solutions including Permanent Staffing, Contract and Project-Based Hiring, Executive & Leadership Search, Volume Recruitment, and specialized cross-border staffing for expanding enterprises.",
    },
    {
      q: "Do you hire for both IT and Non-IT roles?",
      a: "Yes. Our specialized recruitment desks span software engineering, cloud/DevOps, AI/ML, as well as manufacturing, engineering, BFSI, healthcare, textiles, logistics, corporate finance, and operations.",
    },
    {
      q: "Can you support hiring outside India?",
      a: "Yes. Headquartered in Surat, Gujarat, we combine extensive pan-India talent networks with cross-border partnerships to support international remote hiring, distributed teams, and cross-border executive placements.",
    },
    {
      q: "Will we have a dedicated point of contact?",
      a: "Every client partner is assigned a Senior Talent Partner / Hiring Account Manager who becomes the primary liaison from intake calibration through resume screening, interview coordination, and final joining.",
    },
    {
      q: "How can candidates apply for open roles?",
      a: (
        <>
          Candidates can upload their CV directly via our{" "}
          <button
            type="button"
            onClick={onOpenCandidateModal}
            className="faq-inline-btn"
          >
            Submit CV modal
          </button>
          , email{" "}
          <a href="mailto:jobs@oryenza.in" className="faq-inline-link">
            jobs@oryenza.in
          </a>
          , or submit the contact form under "Candidate opportunity". Our team
          reviews all profiles with strict confidentiality.
        </>
      ),
    },
  ];

  const handleScroll = (e) => {
    e.preventDefault();
    const elem = document.querySelector("#contact");
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container faq-layout">
        <div className="faq-intro">
          <div className="kicker">A little more clarity</div>
          <h2>
            Your questions.
            <br />
            <span>Answered.</span>
          </h2>
          <p>
            Want to understand our turnaround SLAs, replacement warranties, or
            fee structures?
          </p>
          <a className="btn primary" href="#contact" onClick={handleScroll}>
            <span>Let's have a conversation</span>
            <ArrowUpRight size={17} />
          </a>
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="faq-item" aria-expanded={isOpen}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span className={`faq-icon ${isOpen ? "open" : ""}`}>+</span>
                </button>
                {isOpen && <div className="faq-answer">{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
