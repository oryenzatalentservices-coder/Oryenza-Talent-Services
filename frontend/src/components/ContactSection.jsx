import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
} from "lucide-react";

export default function ContactSection({
  selectedRequirement,
  onOpenCandidateModal,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    requirement: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState(""); // 'success' | 'error'

  useEffect(() => {
    if (selectedRequirement) {
      setFormData((prev) => ({ ...prev, requirement: selectedRequirement }));
    }
  }, [selectedRequirement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await api.submitInquiry(formData);
      setStatusType("success");
      setStatusMessage(
        res.message ||
          "Inquiry submitted successfully! Our team will reach out within 24 hours.",
      );
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        requirement: "",
        message: "",
      });
    } catch (err) {
      console.error("Submission error:", err);
      setStatusType("error");
      setStatusMessage(
        err.message ||
          "Something went wrong. Please check your details or contact us directly on WhatsApp.",
      );
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Oryenza Team, I would like to discuss hiring requirements for my company.`,
  );

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-head">
          <div className="kicker">Contact us</div>
          <h2>Let’s talk about your hiring needs.</h2>
          <p>
            Share a few details and the Oryenza talent team will follow up to
            understand your exact requirements.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left Column: Office & Contact Info */}
          <div className="contact-info">
            <h3>Connect with Oryenza</h3>
            <p style={{ marginTop: "6px", marginBottom: "22px" }}>
              Hiring across India. Headquartered in Surat, Gujarat.
            </p>

            <div className="contact-item">
              <small>Candidate opportunities</small>
              <a href="mailto:jobs@oryenza.in">jobs@oryenza.in</a>
            </div>

            <div className="contact-item">
              <small>Client & General enquiries</small>
              <a href="mailto:info@oryenza.in">info@oryenza.in</a>
            </div>

            <div className="contact-item">
              <small>Direct Phone & Support</small>
              <a href="tel:+918200057027">+91 82000 57027</a>
            </div>

            <div className="contact-item">
              <small>Corporate Headquarters</small>
              <div className="contact-address">
                B-904, Pragati IT Park, Opp. Shell Petrol Pump, Mota Varachha,
                Surat, Gujarat - 394101
              </div>
            </div>

            <div className="contact-item">
              <small>Official Domain</small>
              <a
                href="https://oryenza.in"
                rel="noopener noreferrer"
                target="_blank"
              >
                oryenza.in ↗
              </a>
            </div>

            <div className="contact-channels">
              <a
                className="btn whatsapp-btn"
                href={`https://wa.me/918200057027?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                type="button"
                className="btn secondary"
                onClick={onOpenCandidateModal}
              >
                <span>Job Seeker? Apply Here</span>
              </button>
            </div>

            <div className="contact-socials">
              <span className="contact-socials-label">Social Media</span>
              <div className="contact-social-links">
                <a
                  className="social-btn linkedin-btn"
                  href="https://www.linkedin.com/company/oryenza/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Oryenza on LinkedIn"
                  title="Connect with Oryenza on LinkedIn"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    style={{ flexShrink: 0 }}
                  >
                    <rect width="24" height="24" rx="5.5" fill="#0A66C2" />
                    <path
                      fill="#ffffff"
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"
                    />
                  </svg>
                  <span>LinkedIn</span>
                </a>

                <a
                  className="social-btn instagram-btn"
                  href="https://www.instagram.com/oryenza.talent?utm_source=ig_web_button_share_sheet&cplk=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Oryenza on Instagram"
                  title="Follow Oryenza on Instagram"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    style={{ flexShrink: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="ig-grad-contact"
                        x1="0%"
                        y1="100%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#fdf497" />
                        <stop offset="5%" stopColor="#fdf497" />
                        <stop offset="45%" stopColor="#fd5949" />
                        <stop offset="60%" stopColor="#d6249f" />
                        <stop offset="90%" stopColor="#285AEB" />
                      </linearGradient>
                    </defs>
                    <rect
                      width="24"
                      height="24"
                      rx="5.5"
                      fill="url(#ig-grad-contact)"
                    />
                    <rect
                      x="4.25"
                      y="4.25"
                      width="15.5"
                      height="15.5"
                      rx="4.5"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.75"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3.75"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.75"
                    />
                    <circle cx="16.5" cy="7.5" r="1.15" fill="#ffffff" />
                  </svg>
                  <span>Instagram</span>
                </a>

                <a
                  className="social-btn x-btn"
                  href="https://x.com/OryenzaTalent"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Oryenza on X"
                  title="Oryenza on X (Twitter)"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    style={{ flexShrink: 0 }}
                  >
                    <rect
                      width="24"
                      height="24"
                      rx="5.5"
                      fill="#000000"
                      stroke="rgba(255, 255, 255, 0.25)"
                      strokeWidth="1"
                    />
                    <g transform="translate(4, 4) scale(0.6667)">
                      <path
                        fill="#ffffff"
                        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
                      />
                    </g>
                  </svg>
                  <span>X (Twitter)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Full-Stack React + Node + MySQL Form */}
          <div className="form-card">
            <h3 style={{ marginBottom: "6px" }}>Submit Hiring Requirement</h3>
            <p style={{ fontSize: "0.9rem", marginBottom: "22px" }}>
              Submissions are stored securely in our database and reviewed
              immediately by our talent consultants.
            </p>

            <form onSubmit={handleSubmit} id="contactForm">
              <label>
                Your name *
                <input
                  name="name"
                  placeholder="Full name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>

              <label>
                Work email *
                <input
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>

              <label>
                Company
                <input
                  name="company"
                  placeholder="Company name"
                  value={formData.company}
                  onChange={handleChange}
                />
              </label>

              <label>
                Phone number
                <input
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </label>

              <label className="full">
                Hiring requirement *
                <select
                  name="requirement"
                  required
                  value={formData.requirement}
                  onChange={handleChange}
                >
                  <option value="">Select a service</option>
                  <option value="Permanent recruitment">
                    Permanent recruitment
                  </option>
                  <option value="Contract / project hiring">
                    Contract / project hiring
                  </option>
                  <option value="Talent sourcing & screening">
                    Talent sourcing & screening
                  </option>
                  <option value="Executive search / Leadership">
                    Executive search / Leadership
                  </option>
                  <option value="Candidate opportunity">
                    Candidate opportunity
                  </option>
                  <option value="Other enquiry">Other enquiry</option>
                </select>
              </label>

              <label className="full">
                How can we help? *
                <textarea
                  name="message"
                  placeholder="Share details on roles, seniority levels, target skills, location, timeline or budget..."
                  required
                  value={formData.message}
                  onChange={handleChange}
                />
              </label>

              <div className="full">
                <button
                  className="btn primary"
                  type="submit"
                  disabled={loading}
                  style={{ width: "100%", padding: "15px 22px" }}
                >
                  {loading ? (
                    <span>Submitting requirement...</span>
                  ) : (
                    <>
                      <span>Send Hiring Requirement</span>
                      <Send size={16} />
                    </>
                  )}
                </button>

                {statusMessage && (
                  <div className={`form-alert ${statusType}`}>
                    {statusType === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    <span>{statusMessage}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
