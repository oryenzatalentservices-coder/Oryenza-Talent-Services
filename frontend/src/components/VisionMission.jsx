import React from "react";

export default function VisionMission() {
  return (
    <section className="vm-section" id="vision-mission">
      <div className="container">
        <div className="section-head">
          <div className="kicker">Our purpose</div>
          <h2>Built around people. Driven by possibility.</h2>
        </div>

        <div className="vm-grid">
          <article className="vm-card">
            <div className="kicker">Our Vision</div>
            <h3>
              Connecting exceptional people with exceptional opportunities.
            </h3>
            <p>
              To become a globally trusted talent solutions partner, connecting
              exceptional people with exceptional career opportunities and
              creating lasting, compounding value for forward-thinking
              businesses and professional communities.
            </p>
          </article>

          <article className="vm-card">
            <div className="kicker">Our Mission</div>
            <h3>Smarter hiring, powered by people.</h3>
            <p>
              To deliver innovative, rapid, and ethical recruitment solutions by
              combining state-of-the-art sourcing tools with deep human
              intuition, helping organizations build resilient, high-performing
              teams and achieve long-term growth.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
