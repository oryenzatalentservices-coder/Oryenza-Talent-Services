import React, { useState } from "react";
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

import "./styles/index.css";
import "./styles/modal.css";

export default function App() {
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState("");
  const [introActive, setIntroActive] = useState(true);

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
        <Hero onOpenCandidateModal={() => setCandidateModalOpen(true)} />

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
    </div>
  );
}
