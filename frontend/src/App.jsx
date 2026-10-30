import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import StatsSection from "./components/StatsSection";
import AboutSection from "./components/AboutSection";
import VisionMission from "./components/VisionMission";
import ServicesSection from "./components/ServicesSection";
import IndustriesSection from "./components/IndustriesSection";
import ProcessSection from "./components/ProcessSection";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";
import CandidateModal from "./components/CandidateModal";
import IntroAnimation from "./components/IntroAnimation";
import AdminDashboard from "./components/AdminDashboard";
import ResumeAtsModal from "./components/ResumeAtsModal";

import "./styles/index.css";
import "./styles/modal.css";

function checkIsAdminUrl() {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, "");
  const hash = window.location.hash.toLowerCase();
  const view = new URLSearchParams(window.location.search).get("view")?.toLowerCase();

  // ONLY /oryenza_admin26 opens the admin side
  return (
    path === "/oryenza_admin26" ||
    hash === "#oryenza_admin26" ||
    view === "oryenza_admin26"
  );
}

export default function App() {
  const [isAdminView, setIsAdminView] = useState(checkIsAdminUrl);
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [atsModalOpen, setAtsModalOpen] = useState(false);
  const [atsModalMode, setAtsModalMode] = useState("analyze");
  const [selectedRequirement, setSelectedRequirement] = useState("");
  const [introActive, setIntroActive] = useState(() => !checkIsAdminUrl());

  // Listen to browser forward/back buttons and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const isAdmin = checkIsAdminUrl();
      setIsAdminView(isAdmin);
      if (isAdmin) setIntroActive(false);
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  // Secret keyboard shortcut: Ctrl + Shift + A (or Alt + A) to toggle Admin Portal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") ||
        (e.altKey && e.key.toLowerCase() === "a")
      ) {
        e.preventDefault();
        setIsAdminView((prev) => {
          const next = !prev;
          if (next) {
            window.history.pushState(null, "", "/oryenza_admin26");
            setIntroActive(false);
          } else {
            window.history.pushState(null, "", "/");
          }
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Render Private Admin Portal
  if (isAdminView) {
    return (
      <AdminDashboard
        onExit={() => {
          setIsAdminView(false);
          window.history.pushState(null, "", "/");
        }}
      />
    );
  }

  return (
    <div className={`app-container ${introActive ? "intro-running" : ""}`}>
      {/* Cinematic "HIRING AGENCY" Opening Split Curtain Intro Animation */}
      {introActive && (
        <IntroAnimation onComplete={() => setIntroActive(false)} />
      )}

      {/* Sticky Header Navigation */}
      <Header onOpenCandidateModal={() => setCandidateModalOpen(true)} />

      <main>
        {/* Hero Section */}
        <Hero
          onOpenCandidateModal={() => setCandidateModalOpen(true)}
          onOpenResumeAts={() => {
            setAtsModalMode("analyze");
            setAtsModalOpen(true);
          }}
          onOpenAnalyzeCv={() => {
            setAtsModalMode("analyze");
            setAtsModalOpen(true);
          }}
          onOpenAtsScore={() => {
            setAtsModalMode("ats");
            setAtsModalOpen(true);
          }}
        />

        {/* Dynamic / Animated KPI Stats */}
        <StatsSection />

        {/* About Oryenza Section */}
        <AboutSection />

        {/* Purpose: Vision & Mission */}
        <VisionMission />

        {/* Core Services Grid */}
        <ServicesSection
          onSelectRequirement={(req) => setSelectedRequirement(req)}
        />

        {/* 21 Industries Served Marquee */}
        <IndustriesSection />

        {/* 5-Stage Interactive Recruitment Process */}
        <ProcessSection />

        {/* Frequently Asked Questions */}
        <FAQSection onOpenCandidateModal={() => setCandidateModalOpen(true)} />

        {/* Employer Intake & Contact Section */}
        <ContactSection
          selectedRequirement={selectedRequirement}
          onOpenCandidateModal={() => setCandidateModalOpen(true)}
        />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating Theme Switcher */}
      <ThemeToggle />

      {/* Candidate Quick-Apply Modal */}
      <CandidateModal
        isOpen={candidateModalOpen}
        onClose={() => setCandidateModalOpen(false)}
      />

      {/* Resume & ATS Intelligence Suite Modal */}
      <ResumeAtsModal
        isOpen={atsModalOpen}
        onClose={() => setAtsModalOpen(false)}
        initialMode={atsModalMode}
        onApplyAsCandidate={() => setCandidateModalOpen(true)}
      />
    </div>
  );
}

