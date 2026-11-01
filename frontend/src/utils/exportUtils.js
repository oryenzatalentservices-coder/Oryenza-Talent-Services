import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Format date nicely for exports
 */
function formatDate(dateStr) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  } catch {
    return dateStr;
  }
}

/**
 * Capitalize status string (e.g., 'in_progress' -> 'In Progress')
 */
function formatStatus(status) {
  if (!status) return "-";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * 1. EXPORT TO EXCEL (.xlsx)
 */
export function exportToExcel(type, data) {
  if (!data || data.length === 0) {
    alert("No records available to export.");
    return;
  }

  const isCandidate = type === "candidates";
  const dateStamp = new Date().toISOString().slice(0, 10);
  const fileName = `oryenza_${type}_${dateStamp}.xlsx`;

  let sheetData = [];
  let colWidths = [];

  if (isCandidate) {
    sheetData = data.map((c, i) => ({
      "#": i + 1,
      ID: c.id,
      "Date Applied": formatDate(c.created_at),
      "Candidate Name": c.name || "-",
      "Current Role": c.current_role || "-",
      "Experience (Years)": c.experience_years != null ? c.experience_years : "-",
      Location: c.preferred_location || "-",
      Email: c.email || "-",
      Phone: c.phone || "-",
      Skills: c.skills || "-",
      Status: formatStatus(c.status),
      "Resume File": c.resume_original_name || c.resume_path || "None",
      "Admin Notes": c.admin_notes || "",
    }));

    colWidths = [
      { wch: 5 },  // #
      { wch: 8 },  // ID
      { wch: 14 }, // Date
      { wch: 22 }, // Name
      { wch: 24 }, // Role
      { wch: 18 }, // Exp
      { wch: 18 }, // Location
      { wch: 28 }, // Email
      { wch: 16 }, // Phone
      { wch: 30 }, // Skills
      { wch: 14 }, // Status
      { wch: 26 }, // Resume
      { wch: 30 }, // Notes
    ];
  } else {
    // Inquiries
    sheetData = data.map((inq, i) => ({
      "#": i + 1,
      ID: inq.id,
      Date: formatDate(inq.created_at),
      "Client Name": inq.name || "-",
      Company: inq.company || "-",
      Email: inq.email || "-",
      Phone: inq.phone || "-",
      Requirement: inq.requirement || "-",
      Status: formatStatus(inq.status),
      Message: inq.message || "-",
      "Admin Notes": inq.admin_notes || "",
    }));

    colWidths = [
      { wch: 5 },  // #
      { wch: 8 },  // ID
      { wch: 14 }, // Date
      { wch: 22 }, // Name
      { wch: 22 }, // Company
      { wch: 28 }, // Email
      { wch: 16 }, // Phone
      { wch: 24 }, // Requirement
      { wch: 14 }, // Status
      { wch: 36 }, // Message
      { wch: 30 }, // Notes
    ];
  }

  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  const sheetTitle = isCandidate ? "Candidate Talent Pool" : "Client Inquiries";
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle);

  XLSX.writeFile(workbook, fileName);
}

/**
 * 2. EXPORT TO PDF (.pdf)
 */
export function exportToPDF(type, data) {
  if (!data || data.length === 0) {
    alert("No records available to export.");
    return;
  }

  const isCandidate = type === "candidates";
  const dateStamp = new Date().toISOString().slice(0, 10);
  const fileName = `oryenza_${type}_${dateStamp}.pdf`;

  // Create PDF in landscape A4 for optimal table fit
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Primary brand header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(11, 25, 44); // #0b192c
  doc.text("ORYENZA TALENT SERVICES", 40, 42);

  // Subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(21, 101, 216); // #1565d8
  doc.text(
    isCandidate
      ? "Candidate Talent Pool Management Report"
      : "Client Hiring Inquiries Report",
    40,
    60
  );

  // Metadata row (Date & Total count)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139); // #64748b
  const reportDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generated: ${reportDate}  |  Total Records: ${data.length}`, 40, 76);

  // Decorative blue divider bar
  doc.setDrawColor(21, 101, 216);
  doc.setLineWidth(2);
  doc.line(40, 85, pageWidth - 40, 85);

  let head = [];
  let body = [];

  if (isCandidate) {
    head = [
      [
        "#",
        "Date",
        "Candidate Name",
        "Current Role",
        "Exp",
        "Location",
        "Email",
        "Phone",
        "Status",
      ],
    ];

    body = data.map((c, i) => [
      String(i + 1),
      formatDate(c.created_at),
      c.name || "-",
      c.current_role || "-",
      c.experience_years != null ? `${c.experience_years} yrs` : "-",
      c.preferred_location || "-",
      c.email || "-",
      c.phone || "-",
      formatStatus(c.status),
    ]);
  } else {
    head = [
      [
        "#",
        "Date",
        "Client Name",
        "Company",
        "Requirement",
        "Email",
        "Phone",
        "Status",
      ],
    ];

    body = data.map((inq, i) => [
      String(i + 1),
      formatDate(inq.created_at),
      inq.name || "-",
      inq.company || "-",
      inq.requirement || "-",
      inq.email || "-",
      inq.phone || "-",
      formatStatus(inq.status),
    ]);
  }

  autoTable(doc, {
    startY: 95,
    margin: { left: 40, right: 40, bottom: 45 },
    head: head,
    body: body,
    theme: "striped",
    headStyles: {
      fillColor: [21, 101, 216], // Brand blue #1565d8
      textColor: [255, 255, 255],
      fontSize: 9.5,
      fontStyle: "bold",
      halign: "left",
      cellPadding: 6,
    },
    bodyStyles: {
      textColor: [11, 25, 44],
      fontSize: 8.5,
      cellPadding: 5.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Clean off-white #f8fafc
    },
    columnStyles: {
      0: { cellWidth: 25, halign: "center" },
      1: { cellWidth: 70 },
      8: { fontStyle: "bold" },
    },
    didDrawPage: (dataObj) => {
      // Footer on every page
      const pageNumber = dataObj.pageNumber;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // #94a3b8

      // Left footer
      doc.text(
        "Confidential • Oryenza Talent Services Internal Management Report",
        40,
        pageHeight - 20
      );

      // Right footer
      doc.text(`Page ${pageNumber}`, pageWidth - 70, pageHeight - 20);
    },
  });

  doc.save(fileName);
}

/**
 * 3. EXPORT TO CSV (.csv)
 */
export function exportToCSV(type, data) {
  if (!data || data.length === 0) {
    alert("No records available to export.");
    return;
  }

  const isCandidate = type === "candidates";
  const dateStamp = new Date().toISOString().slice(0, 10);
  const fileName = `oryenza_${type}_${dateStamp}.csv`;

  let headers = [];
  let rows = [];

  if (isCandidate) {
    headers = [
      "ID",
      "Name",
      "Role",
      "Experience (Yrs)",
      "Location",
      "Email",
      "Phone",
      "Skills",
      "Status",
      "Resume Filename",
      "Date",
    ];

    rows = data.map((c) => [
      c.id,
      `"${(c.name || "").replace(/"/g, '""')}"`,
      `"${(c.current_role || "").replace(/"/g, '""')}"`,
      c.experience_years || 0,
      `"${(c.preferred_location || "").replace(/"/g, '""')}"`,
      `"${c.email || ""}"`,
      `"${c.phone || ""}"`,
      `"${(c.skills || "").replace(/"/g, '""')}"`,
      `"${c.status || ""}"`,
      `"${c.resume_original_name || c.resume_path || "None"}"`,
      `"${new Date(c.created_at).toLocaleDateString()}"`,
    ]);
  } else {
    headers = [
      "ID",
      "Name",
      "Company",
      "Email",
      "Phone",
      "Requirement",
      "Status",
      "Message",
      "Date",
    ];

    rows = data.map((i) => [
      i.id,
      `"${(i.name || "").replace(/"/g, '""')}"`,
      `"${(i.company || "").replace(/"/g, '""')}"`,
      `"${i.email || ""}"`,
      `"${i.phone || ""}"`,
      `"${i.requirement || ""}"`,
      `"${i.status || ""}"`,
      `"${(i.message || "").replace(/"/g, '""')}"`,
      `"${new Date(i.created_at).toLocaleDateString()}"`,
    ]);
  }

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 4. EXPORT EXECUTIVE COMPANY ANALYTICS REPORT (.pdf)
 */
export function exportAnalyticsToPDF(analytics, inquiries = [], candidates = []) {
  if (!analytics) {
    alert("Analytics data is currently unavailable.");
    return;
  }

  const dateStamp = new Date().toISOString().slice(0, 10);
  const fileName = `oryenza_executive_analytics_${dateStamp}.pdf`;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header lockup
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(11, 25, 44); // #0b192c
  doc.text("ORYENZA TALENT SERVICES", 40, 44);

  // Subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(21, 101, 216); // #1565d8
  doc.text("Executive Company & Recruitment Analytics Report", 40, 64);

  // Report metadata
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139); // #64748b
  const reportDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generated: ${reportDate}  |  Classification: Confidential / Leadership Review`, 40, 80);

  // Divider line
  doc.setDrawColor(21, 101, 216);
  doc.setLineWidth(2);
  doc.line(40, 88, pageWidth - 40, 88);

  // Table 1: Executive KPI Metrics
  const kpiHead = [["Strategic Performance Metric", "Current Value", "Executive Context"]];
  const kpiBody = [
    [
      "Placement Conversion Rate",
      `${analytics.placementRate || 0}%`,
      `${analytics.placedCount || 0} successfully placed talent records`,
    ],
    [
      "Active Client Hiring Mandates",
      `${analytics.activeMandates || 0}`,
      `${analytics.closedMandates || 0} closed mandates (${analytics.mandateCloseRate || 0}% close rate)`,
    ],
    [
      "Candidate Talent Pool",
      `${analytics.totalCandidates || 0}`,
      `Total verified applicant pool registered in system`,
    ],
    [
      "Verified CV / Resume Index",
      `${analytics.resumeIndexRate || 0}%`,
      `${analytics.resumesCount || 0} resumes attached & preview-ready`,
    ],
    [
      "Average Candidate Experience",
      `${analytics.avgExperience || 0} Years`,
      `Cross-domain talent seniority index across Gujarat & metros`,
    ],
    [
      "Total Client Inquiries",
      `${analytics.totalInquiries || 0}`,
      `Hiring inquiries received across Permanent & Contract domains`,
    ],
  ];

  autoTable(doc, {
    startY: 102,
    margin: { left: 40, right: 40 },
    head: kpiHead,
    body: kpiBody,
    theme: "striped",
    headStyles: {
      fillColor: [21, 101, 216],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      textColor: [11, 25, 44],
      fontSize: 9,
      cellPadding: 5.5,
    },
    columnStyles: {
      0: { cellWidth: 170, fontStyle: "bold" },
      1: { cellWidth: 95, halign: "center", fontStyle: "bold", textColor: [21, 101, 216] },
      2: { cellWidth: 250 },
    },
  });

  // Table 2: Recruitment Pipeline Funnel Breakdown
  const funnelHead = [["Recruitment Funnel Stage", "Candidate Count", "Pipeline Share", "Status Description"]];
  const total = analytics.totalCandidates || 1;
  const funnelBody = [
    [
      "Applied / Talent Inflow",
      String(analytics.candStatusCounts?.applied || 0),
      `${Math.round(((analytics.candStatusCounts?.applied || 0) / total) * 100)}%`,
      "Initial application submission awaiting recruiter review",
    ],
    [
      "Screening & Dossier Review",
      String(analytics.candStatusCounts?.screening || 0),
      `${Math.round(((analytics.candStatusCounts?.screening || 0) / total) * 100)}%`,
      "Profile & resume undergoing recruiter qualification",
    ],
    [
      "Client Interview / Evaluation",
      String(analytics.candStatusCounts?.interview || 0),
      `${Math.round(((analytics.candStatusCounts?.interview || 0) / total) * 100)}%`,
      "Candidate actively engaged in client interviews / shortlists",
    ],
    [
      "Job Offer Extended",
      String(analytics.candStatusCounts?.offered || 0),
      `${Math.round(((analytics.candStatusCounts?.offered || 0) / total) * 100)}%`,
      "Offer letter released by hiring client, awaiting joining",
    ],
    [
      "Final Placement & Joined",
      String(analytics.candStatusCounts?.placed || 0),
      `${Math.round(((analytics.candStatusCounts?.placed || 0) / total) * 100)}%`,
      "Successfully placed and integrated at client organization",
    ],
    [
      "Archived / Disqualified",
      String(analytics.candStatusCounts?.rejected || 0),
      `${Math.round(((analytics.candStatusCounts?.rejected || 0) / total) * 100)}%`,
      "Profile not matching mandate specifications or withdrawn",
    ],
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 18,
    margin: { left: 40, right: 40 },
    head: funnelHead,
    body: funnelBody,
    theme: "striped",
    headStyles: {
      fillColor: [11, 25, 44],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      textColor: [11, 25, 44],
      fontSize: 9,
      cellPadding: 5.5,
    },
    columnStyles: {
      0: { cellWidth: 155, fontStyle: "bold" },
      1: { cellWidth: 85, halign: "center", fontStyle: "bold" },
      2: { cellWidth: 80, halign: "center" },
      3: { cellWidth: 195 },
    },
  });

  // Table 3: Active Client Hiring Mandates
  if (inquiries && inquiries.length > 0) {
    const mandateHead = [["#", "Client Name", "Company", "Primary Requirement", "Status", "Date"]];
    const mandateBody = inquiries.slice(0, 10).map((inq, idx) => [
      String(idx + 1),
      inq.name || "-",
      inq.company || "-",
      inq.requirement || "-",
      formatStatus(inq.status),
      formatDate(inq.created_at),
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 18,
      margin: { left: 40, right: 40, bottom: 40 },
      head: mandateHead,
      body: mandateBody,
      theme: "striped",
      headStyles: {
        fillColor: [21, 101, 216],
        textColor: [255, 255, 255],
        fontSize: 9.5,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [11, 25, 44],
        fontSize: 8.5,
        cellPadding: 5,
      },
      didDrawPage: (dataObj) => {
        const pageNumber = dataObj.pageNumber;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          "Oryenza Talent Services • Surat, Gujarat • info@oryenza.in • +91 82000 57027",
          40,
          pageHeight - 20
        );
        doc.text(`Page ${pageNumber}`, pageWidth - 70, pageHeight - 20);
      },
    });
  }

  doc.save(fileName);
}
