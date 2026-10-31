import React, { useEffect, useState, useRef, useCallback } from "react";
import { api } from "../services/api";

const DEFAULT_METRICS = [
  { id: "clients", target: 25, label: "Happy clients", suffix: "+" },
  { id: "industries", target: 15, label: "Industries served", suffix: "+" },
  { id: "placements", target: 250, label: "Successful placements", suffix: "+" },
  { id: "global", isText: true, text: "Global", label: "India & beyond" },
];

export default function StatsSection() {
  const [statsData, setStatsData] = useState(DEFAULT_METRICS);
  const [counts, setCounts] = useState({
    clients: 0,
    industries: 0,
    placements: 0,
  });
  const [isInView, setIsInView] = useState(false);

  const sectionRef = useRef(null);
  const animFrameRef = useRef(null);
  const targetsRef = useRef({
    clients: 25,
    industries: 15,
    placements: 250,
  });

  // Fetch dynamic stats from backend API if available
  useEffect(() => {
    let active = true;
    api
      .getStats()
      .then((res) => {
        if (!active) return;
        if (
          res?.success &&
          res?.data?.metrics &&
          res.data.metrics.length >= 3
        ) {
          const metrics = res.data.metrics;
          const updatedTargets = {
            clients: Number(metrics[0]?.metric_value) || 25,
            industries: Number(metrics[1]?.metric_value) || 15,
            placements: Number(metrics[2]?.metric_value) || 250,
          };
          targetsRef.current = updatedTargets;
          setStatsData([
            {
              id: "clients",
              target: updatedTargets.clients,
              label: metrics[0]?.label || "Happy clients",
              suffix: metrics[0]?.suffix || "+",
            },
            {
              id: "industries",
              target: updatedTargets.industries,
              label: metrics[1]?.label || "Industries served",
              suffix: metrics[1]?.suffix || "+",
            },
            {
              id: "placements",
              target: updatedTargets.placements,
              label: metrics[2]?.label || "Successful placements",
              suffix: metrics[2]?.suffix || "+",
            },
            { id: "global", isText: true, text: "Global", label: "India & beyond" },
          ]);
        }
      })
      .catch(() => {
        // Fallback to default KPI targets
      });

    return () => {
      active = false;
    };
  }, []);

  // Run the counting animation smoothly from 0 to targets
  const animateCounters = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const duration = 1600; // ms
    const startTime = performance.now();
    const targets = targetsRef.current;

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo: quick start with silky smooth deceleration
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCounts({
        clients: Math.round(targets.clients * ease),
        industries: Math.round(targets.industries * ease),
        placements: Math.round(targets.placements * ease),
      });

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(update);
      }
    };

    animFrameRef.current = requestAnimationFrame(update);
  }, []);

  // Reset counters to 0 when scrolled away
  const resetCounters = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setCounts({
      clients: 0,
      industries: 0,
      placements: 0,
    });
  }, []);

  // Check visibility for intersection observer & scroll handling
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let isCurrentlyVisible = false;

    const handleVisibilityChange = (visible) => {
      if (visible && !isCurrentlyVisible) {
        isCurrentlyVisible = true;
        setIsInView(true);
        animateCounters();
      } else if (!visible && isCurrentlyVisible) {
        isCurrentlyVisible = false;
        setIsInView(false);
        resetCounters();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        handleVisibilityChange(entry.isIntersecting);
      },
      {
        threshold: 0.2, // Trigger when 20% of section enters viewport
        rootMargin: "0px 0px -40px 0px", // Only trigger once scrolled into view
      }
    );

    observer.observe(el);

    // Initial check in case user is already scrolled to this section on load
    const checkImmediate = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const inView = rect.top < windowHeight - 40 && rect.bottom > 40;
      if (inView && !isCurrentlyVisible) {
        handleVisibilityChange(true);
      }
    };

    const timer = setTimeout(checkImmediate, 300);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [animateCounters, resetCounters]);

  return (
    <section className="stats growth-stats" ref={sectionRef}>
      <div className="container">
        <div className="growth-heading">
          <div className="kicker">Growing Together</div>
          <h2>
            People behind
            <br />
            <span>the progress.</span>
          </h2>
        </div>
        <div className="growth-grid">
          {statsData.map((stat) => (
            <div
              className={`growth-stat ${isInView ? "in-view" : ""}`}
              key={stat.id}
            >
              {stat.isText ? (
                <strong className="stat-text-badge">{stat.text}</strong>
              ) : (
                <strong className="stat-number">
                  {counts[stat.id] ?? 0}
                  {stat.suffix}
                </strong>
              )}
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
