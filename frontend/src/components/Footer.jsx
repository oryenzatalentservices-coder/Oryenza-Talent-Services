import React from "react";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const elem = document.querySelector(targetId);
    if (elem) elem.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-extra">
          <div>
            <div
              className="panel-label"
              style={{
                color: "var(--cyan)",
                textAlign: "left",
                marginBottom: "8px",
              }}
            >
              ORYENZA TALENT SERVICES
            </div>
            <p>
              <strong style={{ color: "#ffffff" }}>
                Win With the Right Hire.
              </strong>
              <br />
              Connecting exceptional people with exceptional opportunities
              across India and beyond. Headquartered in Surat's prime technology
              corridor.
            </p>
          </div>

          <div>
            <div
              className="panel-label"
              style={{
                color: "var(--cyan)",
                textAlign: "left",
                marginBottom: "8px",
              }}
            >
              Let's connect
            </div>
            <div className="footer-contact">
              <a href="mailto:info@oryenza.in">info@oryenza.in</a>
              <br />
              <a href="mailto:jobs@oryenza.in">
                jobs@oryenza.in · Careers & Talent Pool
              </a>
              <br />
              <a href="mailto:sales@oryenza.in">
                sales@oryenza.in · Enterprise Accounts
              </a>
              <br />
              <a href="tel:+918200057027">+91 82000 57027</a>
              <br />
              <a
                href="https://maps.google.com/?q=Pragati+IT+Park,+Opp.+Shell+Petrol+Pump,+Mota+Varachha,+Surat,+Gujarat+394101"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-address-link"
                title="View Pragati IT Park, Surat on Google Maps"
              >
                B-904, Pragati IT Park, Opp. Shell Petrol Pump,<br />
                Mota&nbsp;Varachha, Surat, Gujarat – 394101
              </a>

              <div className="footer-social-row">
                <a
                  href="https://www.linkedin.com/company/oryenza/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon linkedin"
                  aria-label="Oryenza on LinkedIn"
                  title="Connect with Oryenza on LinkedIn"
                >
                  <svg width="36" height="36" viewBox="0 0 24 24">
                    <rect width="24" height="24" rx="5.5" fill="#0A66C2" />
                    <path
                      fill="#ffffff"
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/oryenza.talent?utm_source=ig_web_button_share_sheet&cplk=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon instagram"
                  aria-label="Oryenza on Instagram"
                  title="Follow Oryenza on Instagram"
                >
                  <svg width="36" height="36" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient
                        id="ig-grad-footer"
                        x1="0%"
                        y1="100%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#fdf497" />
                        <stop offset="5%" stopColor="#fdf497" />
                        <stop offset="45%" stopColor="#fd5949" />
                        <stop offset="60%" stopColor="#d6249f" />
                        <stop offset="90%" stopColor="#285AEB" />
                      </linearGradient>
                    </defs>
                    <rect
                      width="24"
                      height="24"
                      rx="5.5"
                      fill="url(#ig-grad-footer)"
                    />
                    <rect
                      x="4.25"
                      y="4.25"
                      width="15.5"
                      height="15.5"
                      rx="4.5"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.75"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3.75"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.75"
                    />
                    <circle cx="16.5" cy="7.5" r="1.15" fill="#ffffff" />
                  </svg>
                </a>
                <a
                  href="https://x.com/OryenzaTalent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon x-twitter"
                  aria-label="Oryenza on X"
                  title="Follow Oryenza on X (Twitter)"
                >
                  <svg width="36" height="36" viewBox="0 0 24 24">
                    <rect
                      width="24"
                      height="24"
                      rx="5.5"
                      fill="#000000"
                      stroke="rgba(255, 255, 255, 0.25)"
                      strokeWidth="1"
                    />
                    <g transform="translate(4, 4) scale(0.6667)">
                      <path
                        fill="#ffffff"
                        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
                      />
                    </g>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-inner">
          <div className="footer-brand-lockup">
            <div className="footer-logo-badge">
              <img
                alt="Oryenza Talent Services logo"
                src="/assets/oryenza_horizontal_logo.png"
                className="footer-logo"
                width="170"
                height="38"
              />
            </div>
            <span className="footer-brand-sep" aria-hidden="true">
              |
            </span>
            <p className="footer-tagline">Win With the Right Hire.</p>
          </div>

          <div className="footer-links">
            <a href="#about" onClick={(e) => handleScroll(e, "#about")}>
              About
            </a>
            <a href="#services" onClick={(e) => handleScroll(e, "#services")}>
              Services
            </a>
            <a
              href="#industries"
              onClick={(e) => handleScroll(e, "#industries")}
            >
              Industries
            </a>
            <a href="#process" onClick={(e) => handleScroll(e, "#process")}>
              Our Process
            </a>
            <a href="#contact" onClick={(e) => handleScroll(e, "#contact")}>
              Contact
            </a>
          </div>
        </div>

        <div className="copyright">
          <span>
            © {CURRENT_YEAR} Oryenza Talent Services. All rights reserved.
          </span>
          <span>Surat, Gujarat, India</span>
        </div>
      </div>
    </footer>
  );
}
