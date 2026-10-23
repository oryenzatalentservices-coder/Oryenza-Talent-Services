import React, { useState, useEffect } from "react";
import "../styles/intro.css";

/**
 * IntroAnimation Component
 *
 * Displays a cinematic full-screen branded splash on initial site visit:
 * 1. Deep navy backdrop (#142b4b) with glowing electric cyan horizontal laser line.
 * 2. Bold text "HIRING AGENCY" centered across the horizontal laser line.
 * 3. Dramatic hold (1.1s), then the screen parts horizontally:
 *    - "HIRING" & left curtain slide off to the LEFT.
 *    - "AGENCY" & right curtain slide off to the RIGHT.
 * 4. Reveals the main website underneath, unlocks scrolling, and unmounts cleanly.
 */
export default function IntroAnimation({ onComplete }) {
  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const forcedPhase = urlParams ? urlParams.get("intro") : null;

  // 'enter' -> 'split' -> 'done'
  const [phase, setPhase] = useState(
    forcedPhase === "midsplit" ? "midsplit" : forcedPhase === "split" ? "split" : "enter"
  );

  useEffect(() => {
    if (forcedPhase === "skip") {
      finishIntro();
      return;
    }

    // Lock scrolling on document body & html while intro is running
    document.documentElement.classList.add("intro-active");
    document.body.classList.add("intro-active");

    if (forcedPhase === "enter" || forcedPhase === "split") {
      // Keep static for testing / inspection
      return;
    }

    // Phase 1: Hold centered (1.1s) then trigger the left/right split
    const splitTimer = setTimeout(() => {
      setPhase("split");
    }, 1100);

    // Phase 2: Split curtain completes sliding offscreen (1.1s + 0.95s = 2.05s)
    const doneTimer = setTimeout(() => {
      finishIntro();
    }, 2100);

    // Keyboard shortcut to skip
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        finishIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(splitTimer);
      clearTimeout(doneTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.classList.remove("intro-active");
      document.body.classList.remove("intro-active");
    };
  }, []);

  const finishIntro = () => {
    setPhase("done");
    document.documentElement.classList.remove("intro-active");
    document.body.classList.remove("intro-active");
    if (onComplete) {
      onComplete();
    }
  };

  if (phase === "done") {
    return null;
  }

  return (
    <aside
      className={`intro-screen-overlay ${phase === "split" ? "is-splitting" : ""} ${phase === "midsplit" ? "is-midsplit" : ""}`}
      onClick={finishIntro}
      aria-label="Oryenza Talent Services Intro Animation"
      role="region"
    >
      {/* Skip Button */}
      <button
        type="button"
        className="intro-skip-btn"
        onClick={(e) => {
          e.stopPropagation();
          finishIntro();
        }}
        aria-label="Skip intro animation"
      >
        Skip ✕
      </button>

      {/* Left Curtain Panel (Slides off to the left) */}
      <div className="intro-curtain intro-curtain-left">
        <div className="intro-laser-line intro-laser-left"></div>
        <div className="intro-word-wrap intro-wrap-left">
          <span className="intro-word intro-word-hiring">HIRING</span>
        </div>
      </div>

      {/* Right Curtain Panel (Slides off to the right) */}
      <div className="intro-curtain intro-curtain-right">
        <div className="intro-laser-line intro-laser-right"></div>
        <div className="intro-word-wrap intro-wrap-right">
          <span className="intro-word intro-word-agency">AGENCY</span>
        </div>
      </div>
    </aside>
  );
}
