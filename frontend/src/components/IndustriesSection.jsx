import React from "react";

export default function IndustriesSection() {
  const track1 = [
    { icon: "⌘", name: "IT & Technology" },
    { icon: "⚙", name: "Manufacturing & Engineering" },
    { icon: "⌁", name: "Cybersecurity" },
    { icon: "▣", name: "E-Commerce & Retail" },
    { icon: "⌂", name: "Real Estate & Construction" },
    { icon: "◈", name: "Chemicals & Materials" },
    { icon: "♙", name: "HR & Administration" },
  ];

  const track2 = [
    { icon: "▤", name: "BFSI" },
    { icon: "↗", name: "Automotive & Mobility" },
    { icon: "☁", name: "Cloud & SaaS" },
    { icon: "✳", name: "Textile & Apparel" },
    { icon: "▱", name: "Education & EdTech" },
    { icon: "⇄", name: "Supply Chain & Logistics" },
    { icon: "↗", name: "Sales & Business Development" },
  ];

  const track3 = [
    { icon: "✚", name: "Healthcare & Life Sciences" },
    { icon: "▦", name: "Semiconductor & Electronics" },
    { icon: "◉", name: "IoT & Robotics" },
    { icon: "✦", name: "Digital Marketing & Advertising" },
    { icon: "ϟ", name: "Energy & Utilities" },
    { icon: "₹", name: "Finance & Accounting" },
    { icon: "⌁", name: "Telecom & Networking" },
  ];

  return (
    <section className="section pale-section" id="industries">
      <div className="container">
        <div className="section-head">
          <div className="kicker">Industry coverage</div>
          <h2>One consultancy. Every industry.</h2>
          <p>
            Different sectors require distinct industry vernacular, market
            knowledge, and talent networks. We tailor searches precisely to the
            technical domain and capabilities your team demands.
          </p>
        </div>

        <div
          className="industry-marquee"
          aria-label="Industries Oryenza supports"
        >
          {/* Row 1 */}
          <div className="industry-row" aria-hidden="true">
            <div className="industry-track">
              {track1.map((item, idx) => (
                <div className="industry" key={`t1-a-${idx}`}>
                  <i>{item.icon}</i>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
            <div className="industry-track">
              {track1.map((item, idx) => (
                <div className="industry" key={`t1-b-${idx}`}>
                  <i>{item.icon}</i>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 (Reverse Direction) */}
          <div className="industry-row" aria-hidden="true">
            <div className="industry-track">
              {track2.map((item, idx) => (
                <div className="industry" key={`t2-a-${idx}`}>
                  <i>{item.icon}</i>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
            <div className="industry-track">
              {track2.map((item, idx) => (
                <div className="industry" key={`t2-b-${idx}`}>
                  <i>{item.icon}</i>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 */}
          <div className="industry-row" aria-hidden="true">
            <div className="industry-track">
              {track3.map((item, idx) => (
                <div className="industry" key={`t3-a-${idx}`}>
                  <i>{item.icon}</i>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
            <div className="industry-track">
              {track3.map((item, idx) => (
                <div className="industry" key={`t3-b-${idx}`}>
                  <i>{item.icon}</i>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="industries-note">
          Across 21 dedicated industry verticals. Every recruitment mandate is
          customized to the specific organizational brief.
        </p>
      </div>
    </section>
  );
}
