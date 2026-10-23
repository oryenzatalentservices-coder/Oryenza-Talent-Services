import React, { useEffect, useState, useRef } from "react";
import { api } from "../services/api";

export default function StatsSection() {
  const [stats, setStats] = useState([
    { target: 25, label: "Happy clients", suffix: "+", value: 0 },
    { target: 15, label: "Industries served", suffix: "+", value: 0 },
    { target: 250, label: "Successful placements", suffix: "+", value: 0 },
    { isText: true, text: "Global", label: "India & beyond" },
  ]);

  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Optionally fetch dynamic stats from backend
    api
      .getStats()
      .then((res) => {
        if (
          res.success &&
          res.data &&
          res.data.metrics &&
          res.data.metrics.length >= 3
        ) {
          const metrics = res.data.metrics;
          setStats([
            {
              target: metrics[0]?.metric_value || 25,
              label: metrics[0]?.label || "Happy clients",
              suffix: metrics[0]?.suffix || "+",
              value: 0,
            },
            {
              target: metrics[1]?.metric_value || 15,
              label: metrics[1]?.label || "Industries served",
              suffix: metrics[1]?.suffix || "+",
              value: 0,
            },
            {
              target: metrics[2]?.metric_value || 250,
              label: metrics[2]?.label || "Successful placements",
              suffix: metrics[2]?.suffix || "+",
              value: 0,
            },
            { isText: true, text: "Global", label: "India & beyond" },
          ]);
        }
      })
      .catch(() => {
        // Fallback to default KPI targets
      });
  }, []);

  const animateCounters = React.useCallback(() => {
    const duration = 1600; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setStats((prev) =>
        prev.map((s) => {
          if (s.isText) return s;
          return { ...s, value: Math.floor(ease * s.target) };
        })
      );

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated, animateCounters]);

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
          {stats.map((stat, idx) => (
            <div className="growth-stat" key={idx}>
              {stat.isText ? (
                <strong>{stat.text}</strong>
              ) : (
                <strong>
                  {stat.value}
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
