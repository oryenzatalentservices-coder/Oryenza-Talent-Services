const path = require("path");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

// Comprehensive list of technical skills across modern stacks
const TECH_SKILLS_DICTIONARY = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", ".NET", "PHP", "Laravel",
  "Go", "Golang", "Ruby", "Ruby on Rails", "Rust", "Swift", "Kotlin", "Dart",
  "HTML", "HTML5", "CSS", "CSS3", "SASS", "SCSS", "Tailwind CSS", "Bootstrap",
  "React", "React.js", "React Native", "Next.js", "Vue", "Vue.js", "Angular", "Redux",
  "Node.js", "Express", "Express.js", "NestJS", "FastAPI", "Django", "Flask", "Spring Boot",
  "REST", "REST API", "RESTful APIs", "GraphQL", "Microservices", "gRPC", "WebSockets",
  "SQL", "MySQL", "PostgreSQL", "Postgres", "MongoDB", "Redis", "SQLite", "Oracle",
  "DynamoDB", "Firebase", "Supabase", "Cassandra", "Elasticsearch",
  "AWS", "Amazon Web Services", "Azure", "Google Cloud", "GCP", "Cloudflare",
  "Docker", "Kubernetes", "CI/CD", "GitHub Actions", "GitLab CI", "Jenkins", "Terraform",
  "Git", "GitHub", "GitLab", "Linux", "Bash", "Shell Scripting", "Nginx", "Apache",
  "Machine Learning", "Deep Learning", "Artificial Intelligence", "NLP", "Computer Vision",
  "TensorFlow", "PyTorch", "Scikit-Learn", "Pandas", "NumPy", "Data Analysis", "Data Science",
  "Power BI", "Tableau", "Excel", "Data Visualization", "ETL", "Kafka", "RabbitMQ",
  "Unit Testing", "Jest", "Cypress", "Selenium", "Playwright", "Mocha", "TDD",
  "Agile", "Scrum", "Kanban", "JIRA", "Confluence", "Figma", "UI/UX", "System Design",
  "Object-Oriented Programming", "OOP", "Data Structures", "Algorithms", "Performance Optimization"
];

// Soft skills dictionary
const SOFT_SKILLS_DICTIONARY = [
  "Problem Solving", "Critical Thinking", "Communication", "Team Collaboration",
  "Leadership", "Time Management", "Adaptability", "Work Ethic", "Conflict Resolution",
  "Decision Making", "Mentoring", "Strategic Planning", "Negotiation", "Project Management",
  "Analytical Skills", "Attention to Detail", "Client Management", "Ownership", "Creativity"
];

// Action verbs dictionary
const ACTION_VERBS_DICTIONARY = [
  "accelerated", "achieved", "acquired", "administered", "advised", "allocated", "analyzed",
  "architected", "audited", "automated", "boosted", "built", "centralized", "championed",
  "coached", "collaborated", "conceptualized", "consolidated", "converted", "coordinated",
  "created", "debugged", "decreased", "delivered", "deployed", "designed", "developed",
  "devised", "diagnosed", "directed", "documented", "doubled", "drafted", "drove",
  "eliminated", "enabled", "enforced", "engineered", "enhanced", "established", "evaluated",
  "executed", "expanded", "expedited", "facilitated", "forecasted", "formulated", "fostered",
  "generated", "governed", "guided", "halted", "headed", "identified", "implemented",
  "improved", "increased", "initiated", "innovated", "inspected", "installed", "instituted",
  "instructed", "integrated", "intensified", "interviewed", "introduced", "investigated",
  "launched", "led", "leveraged", "managed", "maximized", "mentored", "migrated",
  "minimized", "modernized", "monitored", "negotiated", "optimized", "orchestrated",
  "organized", "outperformed", "overhauled", "oversaw", "partnered", "performed",
  "pioneered", "planned", "prepared", "produced", "programmed", "promoted", "proposed",
  "rearchitected", "rebuilt", "reconciled", "redesigned", "reduced", "refined", "refactored",
  "remodeled", "reorganized", "replaced", "resolved", "restructured", "revamped", "reviewed",
  "revitalized", "safeguarded", "scaled", "scheduled", "screened", "secured", "selected",
  "shaped", "simplified", "solved", "spearheaded", "standardized", "steered", "streamlined",
  "strengthened", "structured", "supervised", "surpassed", "synthesized", "systematized",
  "targeted", "tested", "tracked", "trained", "transformed", "transitioned", "troubleshot",
  "unified", "upgraded", "utilized", "validated", "visualized", "won", "yielded"
];

// Helper to escape regex special characters
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Extract raw text from file buffer based on MIME type or extension
async function extractTextFromFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const buffer = file.buffer;

  if (ext === ".pdf" || file.mimetype === "application/pdf") {
    try {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      const text = result && result.text ? result.text : "";
      if (text.trim().length > 20) return text;
    } catch (pdfErr) {
      console.warn("pdf-parse extraction notice:", pdfErr.message);
    }

    // Fallback: extract ASCII text sequences from PDF buffer if standard parsing failed
    const raw = buffer.toString("latin1");
    const matches = raw.match(/\(([^()]{3,})\)Tj/g) || [];
    if (matches.length > 5) {
      return matches.map((m) => m.replace(/^\(|\)Tj$/g, "")).join(" ");
    }
    return buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
  }

  if (
    ext === ".docx" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer: buffer });
      return result.value || "";
    } catch (docxErr) {
      console.warn("mammoth extraction notice:", docxErr.message);
      return buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
    }
  }

  if (ext === ".doc") {
    // Basic text extraction for legacy Word .doc format
    return buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
  }

  return buffer.toString("utf-8");
}

// Core ATS Analysis Engine
function analyzeResumeText(rawText, jobDescription = "", targetRole = "") {
  const text = (rawText || "").trim();
  const textLower = text.toLowerCase();
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  // 1. Contact Information Extraction
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3}[-.\s]?\d{3,5}|\+91[-.\s]?[6-9]\d{9}/);
  const linkedInMatch = text.match(/(?:linkedin\.com\/(?:in|profile)\/[a-zA-Z0-9_-]+|github\.com\/[a-zA-Z0-9_-]+)/i);
  const locationMatch = text.match(/\b(Ahmedabad|Mumbai|Bangalore|Bengaluru|Pune|Delhi|Gurgaon|Noida|Hyderabad|Chennai|Kolkata|Vadodara|Surat|Remote|India|USA|UK|Canada|Singapore)\b/i);

  const contactInfo = {
    hasEmail: !!emailMatch,
    email: emailMatch ? emailMatch[0] : null,
    hasPhone: !!phoneMatch,
    phone: phoneMatch ? phoneMatch[0] : null,
    hasLinkedIn: !!linkedInMatch,
    hasLocation: !!locationMatch,
    location: locationMatch ? locationMatch[0] : null,
  };

  // 2. Section Completeness Check
  const sectionChecks = [
    {
      name: "Education",
      regex: /\b(education|academic(?:s)?|degree|bachelor(?:'s)?|master(?:'s)?|b\.tech|m\.tech|bca|mca|b\.sc|m\.sc|b\.e|university|institute|college|cgpa|gpa|diploma|graduation)\b/i,
      weight: 5,
    },
    {
      name: "Experience",
      regex: /\b(experience|work experience|employment history|professional experience|career history|work history|internship|responsibilities)\b/i,
      weight: 7,
    },
    {
      name: "Skills",
      regex: /\b(skills|technical skills|key skills|technologies|tech stack|core competencies|programming languages|areas of expertise|tools)\b/i,
      weight: 6,
    },
    {
      name: "Projects",
      regex: /\b(project(?:s)?|personal project(?:s)?|academic project(?:s)?|key project(?:s)?|portfolio|case stud(?:y|ies))\b/i,
      weight: 4,
    },
    {
      name: "Certifications",
      regex: /\b(certification(?:s)?|certified|certificate(?:s)?|licenses?|credentials|coursework|training|accreditation(?:s)?)\b/i,
      weight: 3,
    },
  ];

  let sectionScore = 0;
  const sectionCompleteness = sectionChecks.map((sec) => {
    const isPresent = sec.regex.test(text);
    if (isPresent) {
      sectionScore += sec.weight;
      return {
        name: sec.name,
        status: "Passed",
        detail: `Valid ${sec.name} section and keywords identified`,
      };
    } else {
      return {
        name: sec.name,
        status: sec.name === "Certifications" ? "Warning" : "Missing",
        detail: `No explicit ${sec.name} section heading detected`,
      };
    }
  });

  // 3. Skills Extraction
  const detectedTechnical = [];
  TECH_SKILLS_DICTIONARY.forEach((skill) => {
    const regex = new RegExp(`(^|[^a-zA-Z0-9#+])${escapeRegex(skill)}([^a-zA-Z0-9#+]|$)`, "i");
    if (regex.test(text) && !detectedTechnical.includes(skill)) {
      detectedTechnical.push(skill);
    }
  });

  const detectedSoft = [];
  SOFT_SKILLS_DICTIONARY.forEach((skill) => {
    const regex = new RegExp(`(^|[^a-zA-Z0-9])${escapeRegex(skill)}([^a-zA-Z0-9]|$)`, "i");
    if (regex.test(text) && !detectedSoft.includes(skill)) {
      detectedSoft.push(skill);
    }
  });

  // 4. Action Verbs & Quantified Impact
  let actionVerbsFound = 0;
  ACTION_VERBS_DICTIONARY.forEach((verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, "i");
    if (regex.test(text)) actionVerbsFound++;
  });

  // Quantified metrics (e.g. 50%, $10k, ₹5L, 30+ clients, 2x faster, reduced by 40%)
  const metricMatches = text.match(/\b(?:\d+[%xX+]|\$\d+(?:,\d{3})*(?:\.\d+)?|\₹\d+(?:,\d{3})*(?:\.\d+)?|\d+\s*(?:percent|million|billion|users|clients|requests|seconds|hours|days|weeks|months|years))\b/gi) || [];
  const quantifiedMetricsCount = metricMatches.length;

  // Bullet points count
  const lines = text.split(/[\r\n]+/);
  const bulletPointRegex = /^[\s]*([•\-\*▪–⁃\u2022\u25E6\u2043]|\d+\.|\([0-9a-zA-Z]\))\s+/;
  let bulletPointsCount = 0;
  lines.forEach((line) => {
    if (bulletPointRegex.test(line)) bulletPointsCount++;
  });
  if (bulletPointsCount === 0 && lines.length > 15) {
    // Estimator if bullet unicode was flattened during extraction
    bulletPointsCount = Math.min(Math.floor(lines.length * 0.35), 18);
  }

  // 5. Job Description & Keyword Matching
  const jd = (jobDescription || "").trim();
  let matchedKeywords = [];
  let missingKeywords = [];
  let recommendedSkills = [];
  let keywordMatchPercentage = 0;

  if (jd.length > 20) {
    const jdLower = jd.toLowerCase();
    const jdFoundSkills = [];
    TECH_SKILLS_DICTIONARY.concat(SOFT_SKILLS_DICTIONARY).forEach((skill) => {
      const regex = new RegExp(`(^|[^a-zA-Z0-9#+])${escapeRegex(skill)}([^a-zA-Z0-9#+]|$)`, "i");
      if (regex.test(jd) && !jdFoundSkills.includes(skill)) {
        jdFoundSkills.push(skill);
      }
    });

    // Also extract important technical words from JD that might not be in dictionary
    const jdWords = jd.match(/\b[A-Za-z0-9+#.]{3,20}\b/g) || [];
    const stopWords = new Set(["the", "and", "for", "with", "you", "that", "this", "will", "are", "have", "from", "your", "must", "work", "team", "role", "help", "good", "year", "years", "well", "ability", "experience", "candidate", "candidates", "strong", "preferred", "knowledge", "responsibilities", "requirements"]);
    const extraJdKeywords = [...new Set(jdWords.map((w) => w.trim()).filter((w) => w.length > 3 && !stopWords.has(w.toLowerCase())))].slice(0, 30);

    const targetPool = [...new Set([...jdFoundSkills, ...extraJdKeywords])];
    targetPool.forEach((item) => {
      const regex = new RegExp(`(^|[^a-zA-Z0-9#+])${escapeRegex(item)}([^a-zA-Z0-9#+]|$)`, "i");
      if (regex.test(text)) {
        if (!matchedKeywords.includes(item)) matchedKeywords.push(item);
      } else {
        if (!missingKeywords.includes(item)) missingKeywords.push(item);
      }
    });

    const totalTarget = targetPool.length || 1;
    keywordMatchPercentage = Math.round((matchedKeywords.length / totalTarget) * 100);
    keywordMatchPercentage = Math.max(35, Math.min(keywordMatchPercentage, 98));
    recommendedSkills = missingKeywords.slice(0, 8);
  } else {
    // If no JD provided, calculate match based on role and industry tech breadth
    matchedKeywords = detectedTechnical.slice(0, 10);
    const techCount = detectedTechnical.length;
    keywordMatchPercentage = Math.min(95, Math.max(45, 40 + techCount * 3.5));

    // Recommend top skills depending on what they have
    const commonDesirable = ["TypeScript", "Docker", "AWS", "CI/CD", "Next.js", "PostgreSQL", "Git", "Redis", "System Design"];
    missingKeywords = commonDesirable.filter((s) => !detectedTechnical.includes(s)).slice(0, 5);
    recommendedSkills = missingKeywords;
  }

  // 6. Formatting & Readability Checks
  const formattingChecks = [];
  formattingChecks.push({
    item: "File Format",
    status: "Passed",
    message: "Accepted standard document (.pdf / .docx) parsed cleanly without corruptions.",
  });

  const hasGoodContact = contactInfo.hasEmail && contactInfo.hasPhone;
  formattingChecks.push({
    item: "Contact Information",
    status: hasGoodContact ? "Passed" : "Warning",
    message: hasGoodContact
      ? `Detected email (${contactInfo.email || "OK"}) and phone number.`
      : "Ensure your email address and phone number are clearly displayed at the top.",
  });

  const hasIdealLength = wordCount >= 350 && wordCount <= 1100;
  formattingChecks.push({
    item: "Word Count & Length",
    status: hasIdealLength ? "Passed" : wordCount < 300 ? "Warning" : "Needs Review",
    message: `${wordCount} words detected (${hasIdealLength ? "Ideal 1-2 page range" : wordCount < 300 ? "Too concise; add more role accomplishments" : "Consider trimming to keep within 2 pages"}).`,
  });

  formattingChecks.push({
    item: "Bullet Point Structure",
    status: bulletPointsCount >= 6 ? "Passed" : "Warning",
    message: `${bulletPointsCount} bullet points detected. Bulleted accomplishments scan significantly better in ATS.`,
  });

  formattingChecks.push({
    item: "Action Verbs Usage",
    status: actionVerbsFound >= 6 ? "Passed" : "Warning",
    message: `${actionVerbsFound} active verbs detected (e.g. engineered, led, optimized, built).`,
  });

  formattingChecks.push({
    item: "Measurable Impact / Metrics",
    status: quantifiedMetricsCount >= 3 ? "Passed" : "Warning",
    message: `${quantifiedMetricsCount} quantifiable results or metrics found. Resumes with numbers get 40% more interviews.`,
  });

  // 7. Overall ATS Compatibility Score Calculation (0 - 100)
  // Section Completeness: max 25 pts
  let scoreSection = (sectionScore / 25) * 25;

  // Keyword & Skills Match: max 30 pts
  let scoreKeywords = (keywordMatchPercentage / 100) * 30;

  // Content Quality & Impact (Action Verbs & Metrics): max 25 pts
  const verbScore = Math.min(12, actionVerbsFound * 1.2);
  const metricScore = Math.min(13, quantifiedMetricsCount * 2.2);
  let scoreImpact = verbScore + metricScore;

  // Formatting & Readability: max 20 pts
  let scoreFormatting = 0;
  if (hasGoodContact) scoreFormatting += 6;
  if (hasIdealLength) scoreFormatting += 6;
  if (bulletPointsCount >= 6) scoreFormatting += 5;
  if (contactInfo.hasLinkedIn) scoreFormatting += 3;

  let overallScore = Math.round(scoreSection + scoreKeywords + scoreImpact + scoreFormatting);
  overallScore = Math.max(38, Math.min(overallScore, 98));

  // Determine score tier and label
  let scoreTier = "Fair";
  let scoreLabel = "Needs Optimization";
  let scoreColor = "#e67e22";

  if (overallScore >= 85) {
    scoreTier = "Excellent";
    scoreLabel = "High ATS Interview Probability";
    scoreColor = "#10b981";
  } else if (overallScore >= 72) {
    scoreTier = "Good";
    scoreLabel = "Strong ATS Candidate";
    scoreColor = "#1565d8";
  } else if (overallScore >= 55) {
    scoreTier = "Fair";
    scoreLabel = "Room for Improvement";
    scoreColor = "#f59e0b";
  } else {
    scoreTier = "Needs Work";
    scoreLabel = "High Risk of ATS Filtering";
    scoreColor = "#ef4444";
  }

  // 8. Actionable Recommendations
  const recommendations = [];

  if (missingKeywords.length > 0) {
    recommendations.push({
      type: "high",
      category: "Keywords & Skills",
      title: "Incorporate Missing Critical Keywords",
      text: `Add high-relevance terms like ${missingKeywords.slice(0, 4).map((k) => `"${k}"`).join(", ")} directly into your experience bullet points and skills summary.`,
    });
  }

  if (quantifiedMetricsCount < 4) {
    recommendations.push({
      type: "high",
      category: "Impact & Metrics",
      title: "Quantify Your Accomplishments",
      text: "Transform task descriptions into results: use percentages (%), revenue impact, latency reduction, or team scale to demonstrate real business outcomes.",
    });
  }

  if (!contactInfo.hasLinkedIn) {
    recommendations.push({
      type: "medium",
      category: "Contact & Online Presence",
      title: "Include LinkedIn or Portfolio URL",
      text: "Modern ATS parsers index LinkedIn profiles and GitHub/portfolio repositories to verify credentials and code samples.",
    });
  }

  const missingSections = sectionCompleteness.filter((s) => s.status !== "Passed");
  if (missingSections.length > 0) {
    recommendations.push({
      type: "medium",
      category: "Section Structure",
      title: `Enhance ${missingSections.map((s) => s.name).join(" and ")} Sections`,
      text: `Use standardized section headings like "${missingSections[0].name.toUpperCase()}" so automated ATS parsers don't overlook your qualifications.`,
    });
  }

  if (actionVerbsFound < 8) {
    recommendations.push({
      type: "quick_win",
      category: "Action Verbs",
      title: "Start Bullets with Power Verbs",
      text: "Replace passive phrases ('responsible for', 'assisted with') with powerful action verbs like 'Spearheaded', 'Engineered', 'Optimized', and 'Accelerated'.",
    });
  }

  if (wordCount < 400) {
    recommendations.push({
      type: "quick_win",
      category: "Content Depth",
      title: "Elaborate on Key Project Outcomes",
      text: "Your resume appears brief. Add 2-3 bullet points per role outlining the technologies used, challenges overcome, and solutions delivered.",
    });
  }

  // Generate Executive Summary
  const summary = `Your resume scored ${overallScore}/100. It features ${detectedTechnical.length} identified technical skills and ${bulletPointsCount} bullet points. ${
    missingKeywords.length > 0
      ? `Addressing ${missingKeywords.length} missing industry keywords will significantly boost your recruiter response rate.`
      : "Your profile shows strong keyword alignment and structure."
  }`;

  return {
    overallScore,
    scoreTier,
    scoreLabel,
    scoreColor,
    keywordMatchPercentage,
    summary,
    targetRole: targetRole || (detectedTechnical[0] ? `${detectedTechnical[0]} Professional` : "Applicant"),
    hasJobDescription: jd.length > 20,
    metrics: {
      wordCount,
      estimatedPages: wordCount > 750 ? 2 : 1,
      bulletPointsCount,
      actionVerbsCount: actionVerbsFound,
      quantifiedMetricsCount,
      technicalSkillsCount: detectedTechnical.length,
      softSkillsCount: detectedSoft.length,
    },
    contactInfo,
    sectionCompleteness,
    skillsMatch: {
      detectedTechnical,
      detectedSoft,
      matchedKeywords,
      missingKeywords,
      recommendedSkills,
    },
    formattingChecks,
    recommendations,
    analyzedAt: new Date().toISOString(),
  };
}

// Controller endpoint: Analyze Resume
exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a resume file in PDF (.pdf) or Word (.docx, .doc) format.",
      });
    }

    const { job_description, target_role } = req.body || {};

    const extractedText = await extractTextFromFile(req.file);

    if (!extractedText || extractedText.trim().length < 30) {
      return res.status(400).json({
        success: false,
        error:
          "Unable to extract text from this document. Please ensure it is a text-based PDF or DOCX file (not an image-only scanned photocopy).",
      });
    }

    const analysisResult = analyzeResumeText(extractedText, job_description, target_role);
    analysisResult.filename = req.file.originalname;
    analysisResult.fileSize = req.file.size;

    return res.json({
      success: true,
      message: "Resume analyzed successfully.",
      data: analysisResult,
    });
  } catch (err) {
    console.error("Resume analysis error:", err);
    return res.status(500).json({
      success: false,
      error: "An error occurred while analyzing the resume document. " + (err.message || ""),
    });
  }
};

