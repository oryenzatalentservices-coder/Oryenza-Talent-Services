import React, { useMemo } from "react";

const ROLE = {
  call: {
    bg: "#1565d8",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
      </svg>
    ),
  },
  pay: {
    bg: "#0b1f3a",
    icon: (
      <svg viewBox="0 0 24 24">
        <text
          x="12"
          y="18"
          textAnchor="middle"
          fontSize="15"
          fontWeight="800"
          fill="#fff"
          fontFamily="sans-serif"
        >
          ₹
        </text>
      </svg>
    ),
  },
  job: {
    bg: "#094293",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3h9l4 4v14H6zM9 12h7M9 16h7" />
      </svg>
    ),
  },
  src: {
    bg: "#00b8d9",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="10" cy="10" r="6" />
        <path d="M15 15l6 6" />
      </svg>
    ),
  },
  msg: {
    bg: "#0d346e",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 5h16v11H10l-4 4v-4H4z" />
      </svg>
    ),
  },
};

// Calibrated geometry with zero collision between rings and zero overlap with pills/tags
const RINGS = [
  {
    d: 68,
    dir: "normal",
    r: 20.5,
    s: 8.2,
    items: [
      {
        a: 30,
        shirt: "#1565d8",
        role: "call",
        bg: "#dbe9fe",
        skin: "#f2c49b",
        hair: "#1e293b",
      },
      {
        a: 150,
        shirt: "#094293",
        role: "pay",
        bg: "#d1e3fb",
        skin: "#d99b6c",
        hair: "#3b2314",
      },
      {
        a: 270,
        shirt: "#0b1f3a",
        role: "job",
        bg: "#cfe3fa",
        skin: "#eec19a",
        hair: "#172554",
      },
    ],
  },
  {
    d: 105,
    dir: "reverse",
    r: 32.5,
    s: 7.2,
    items: [
      {
        a: 24,
        shirt: "#00b8d9",
        role: "src",
        bg: "#e0f2fe",
        skin: "#e5b487",
        hair: "#1e293b",
      },
      {
        a: 96,
        shirt: "#0d346e",
        role: "msg",
        bg: "#dbeafe",
        skin: "#bb7b4c",
        hair: "#0f172a",
      },
      {
        a: 168,
        shirt: "#0b1f3a",
        role: "job",
        bg: "#e2e8f0",
        skin: "#f2c49b",
        hair: "#3b2314",
      },
      {
        a: 240,
        shirt: "#1565d8",
        role: "call",
        bg: "#dbe9fe",
        skin: "#d99b6c",
        hair: "#1e293b",
      },
      {
        a: 312,
        shirt: "#0d346e",
        role: "msg",
        bg: "#dbeafe",
        skin: "#f2c49b",
        hair: "#172554",
      },
    ],
  },
];

export default function HeroOrbit() {
  const tickLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 180; i++) {
      const a = i * 2;
      const r = (a * Math.PI) / 180;
      const len =
        3.5 + 3.5 * Math.abs(Math.sin(i * 0.35)) + 1.8 * Math.sin(i * 0.11);
      const x1 = (Math.sin(r) * (69 - len)).toFixed(2);
      const y1 = (-Math.cos(r) * (69 - len)).toFixed(2);
      const x2 = (Math.sin(r) * 69).toFixed(2);
      const y2 = (-Math.cos(r) * 69).toFixed(2);
      lines.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--orbit-ring)"
          strokeWidth="0.55"
          strokeLinecap="round"
          opacity="0.85"
        />,
      );
    }
    return lines;
  }, []);

  return (
    <div className="hero-orbit-stage" id="hero-orbit-stage">
      {/* Precision Radial Ticks */}
      <svg
        className="orbit-ticks"
        viewBox="-100 -100 200 200"
        aria-hidden="true"
      >
        {tickLines}
      </svg>

      {/* Perfectly Concentric Guide Tracks */}
      <div className="orbit-inner-track"></div>
      <div className="orbit-outer-track"></div>

      {/* Central Brand Core Hub */}
      <div className="orbit-core">
        <img
          src="/assets/brand_symbol.png"
          alt="Oryenza Talent Services official symbol"
          loading="eager"
        />
      </div>

      {/* Official Stylized Wordmark Under Core */}
      <div className="orbit-brand" aria-label="ORYENZA">
        <img
          src="/assets/oryenza_wordmark.png"
          alt="ORYENZA"
          className="orbit-brand-img orbit-brand-light"
          loading="eager"
        />
        <img
          src="/assets/oryenza_wordmark_dark.png"
          alt="ORYENZA"
          className="orbit-brand-img orbit-brand-dark"
          loading="eager"
        />
      </div>

      {/* Corner Badges / Country Tags */}
      <div className="orbit-tag orbit-tag-india">India</div>
      <div className="orbit-tag orbit-tag-global">Global reach</div>

      {/* Floating Pill Badges (Positioned Safely Outside Outer Orbit) */}
      <div className="orbit-pill orbit-pill-tech">
        <b>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <rect x="6" y="6" width="12" height="12" rx="2" />
            <rect x="9.5" y="9.5" width="5" height="5" />
            <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
          </svg>
        </b>
        <span>IT &amp; Technology</span>
      </div>

      <div className="orbit-pill orbit-pill-tagline">
        <b>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="9" cy="8" r="4" />
            <path d="M2 21c0-4 3-6 7-6M15 17l2 2 5-5" />
          </svg>
        </b>
        <span>The right talent. The right fit.</span>
      </div>

      {/* Dynamic Candidate Avatar Rings */}
      {RINGS.map((ring, ringIdx) => (
        <div
          key={ringIdx}
          className="orbit-ring-track"
          style={{
            "--d": `${ring.d}s`,
            "--dir": ring.dir,
            "--rdir": ring.dir === "normal" ? "reverse" : "normal",
          }}
        >
          {ring.items.map((it, itemIdx) => (
            <div
              key={itemIdx}
              className="orbit-avatar-wrap"
              style={{
                "--a": `${it.a}deg`,
                "--r": ring.r,
                "--s": ring.s,
                "--d": `${ring.d}s`,
                "--rdir": ring.dir === "normal" ? "reverse" : "normal",
              }}
            >
              <div className="orbit-avatar-ctr">
                <div className="orbit-face" style={{ "--c": it.bg }}>
                  <div className="orbit-face-clip">
                    <svg viewBox="0 0 40 40">
                      <path d="M2 40C2 24 38 24 38 40Z" fill={it.shirt} />
                      <circle cx="20" cy="17" r="8" fill={it.skin} />
                      <path
                        d="M12 16C12 7 28 7 28 16C25 12 15 12 12 16Z"
                        fill={it.hair}
                      />
                    </svg>
                  </div>
                  <i
                    className="orbit-role-badge"
                    style={{ "--b": ROLE[it.role].bg }}
                  >
                    {ROLE[it.role].icon}
                  </i>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
