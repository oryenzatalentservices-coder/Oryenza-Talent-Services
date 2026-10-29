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
