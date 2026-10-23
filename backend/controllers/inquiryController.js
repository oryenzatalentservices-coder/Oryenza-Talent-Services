const { db } = require("../config/db");

// Handle submission of a new client inquiry
exports.createInquiry = async (req, res) => {
  try {
    const { name, email, company, phone, requirement, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Full name is required." });
    }
    if (name.length > 150) {
      return res.status(400).json({ success: false, error: "Name is too long (max 150 characters)." });
    }
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: "A valid email address is required." });
    }
    if (email.length > 150) {
      return res.status(400).json({ success: false, error: "Email address is too long." });
    }
    if (company && company.length > 150) {
      return res.status(400).json({ success: false, error: "Company name is too long." });
    }
    if (phone && phone.length > 50) {
      return res.status(400).json({ success: false, error: "Phone number is too long." });
    }
    if (!requirement || !requirement.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Please select a hiring requirement." });
    }
    if (!message || !message.trim()) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Please provide details in the message field.",
        });
    }
    if (message.length > 3000) {
      return res.status(400).json({
        success: false,
        error: "Message is too long (max 3000 characters).",
      });
    }

    const newInquiry = await db.createInquiry({
      name: name.trim().slice(0, 150),
      email: email.trim().toLowerCase().slice(0, 150),
      company: company ? company.trim().slice(0, 150) : null,
      phone: phone ? phone.trim().slice(0, 50) : null,
      requirement: requirement.trim().slice(0, 150),
      message: message.trim().slice(0, 3000),
    });

    return res.status(201).json({
      success: true,
      message:
        "Thank you! Your hiring inquiry has been received. The Oryenza team will contact you shortly.",
      data: newInquiry,
    });
  } catch (err) {
    console.error("Error creating inquiry:", err);
    return res
      .status(500)
      .json({
        success: false,
        error: "Failed to process inquiry. Please try again.",
      });
  }
};

// Get all inquiries (Admin / Management)
exports.getInquiries = async (req, res) => {
  try {
    const { status } = req.query;
    const inquiries = await db.getInquiries({ status });
    return res.json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch inquiries." });
  }
};

// Update inquiry status or admin notes
exports.updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const validStatuses = ["new", "in_progress", "contacted", "closed"];
    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid status value." });
    }

    const updated = await db.updateInquiry(id, { status, admin_notes });
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Inquiry not found." });
    }

    return res.json({
      success: true,
      message: "Inquiry updated successfully.",
      data: updated,
    });
  } catch (err) {
    console.error("Error updating inquiry:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update inquiry." });
  }
};

// Delete inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteInquiry(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, error: "Inquiry not found." });
    }
    return res.json({
      success: true,
      message: "Inquiry deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting inquiry:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete inquiry." });
  }
};
