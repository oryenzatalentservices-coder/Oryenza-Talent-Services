import React, { useState } from "react";
import { api } from "../services/api";
import { MessageCircle, Send, CheckCircle2, AlertCircle } from "lucide-react";

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

  const [prevSelectedReq, setPrevSelectedReq] = useState(selectedRequirement);
  if (selectedRequirement && selectedRequirement !== prevSelectedReq) {
    setPrevSelectedReq(selectedRequirement);
    setFormData((prev) => ({ ...prev, requirement: selectedRequirement }));
  }

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
      try {
        const saved = res?.data || {
          id: Date.now(),
          ...formData,
          status: "new",
          created_at: new Date().toISOString(),
        };
        const currentList = JSON.parse(
          localStorage.getItem("oryenza_true_inquiries") || "[]"
        );
        currentList.unshift(saved);
        localStorage.setItem(
          "oryenza_true_inquiries",
          JSON.stringify(currentList.slice(0, 100))
        );
      } catch (_) {}
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
              <a
                href="https://maps.google.com/?q=Surat,+Gujarat,+India"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-address"
                title="View Surat, Gujarat, India on Google Maps"
              >
                Surat, Gujarat, India
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

                <a
                  className="social-btn facebook-btn"
                  href="https://facebook.com/share/1E6GSDVZvw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Oryenza on Facebook"
                  title="Follow Oryenza on Facebook"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    style={{ flexShrink: 0 }}
                  >
                    <rect width="24" height="24" rx="5.5" fill="#1877F2" />
                    <path
                      fill="#ffffff"
                      d="M15.117 8.008V6.156c0-.853.567-1.05 1.01-1.05h1.83V2.05L15.44 2C12.65 2 12 3.738 12 5.922v2.086H9.5v3.134H12V22h3.917V11.142h2.825l.37-3.134h-3.995z"
                    />
                  </svg>
                  <span>Facebook</span>
                </a>

                <a
                  className="social-btn whatsapp-btn"
                  href="https://chat.whatsapp.com/LWswD7SeIf22btGoNETsLw"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join Oryenza WhatsApp Community"
                  title="Join Oryenza WhatsApp Community"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    style={{ flexShrink: 0 }}
                  >
                    <rect width="24" height="24" rx="5.5" fill="#25D366" />
                    <g transform="translate(4, 4) scale(0.6667)">
                      <path
                        fill="#ffffff"
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.889-9.885 9.889m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                      />
                    </g>
                  </svg>
                  <span>WhatsApp Community</span>
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
                  maxLength={100}
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
                  maxLength={100}
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>

              <label>
                Company
                <input
                  name="company"
                  placeholder="Company name"
                  maxLength={100}
                  value={formData.company}
                  onChange={handleChange}
                />
              </label>

              <label>
                Phone number
                <input
                  name="phone"
                  placeholder="Enter phone number"
                  maxLength={30}
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
                  maxLength={2000}
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

                {statusType === "success" && (
                  <div className="contact-whatsapp-success-box">
                    <p style={{ margin: "0 0 10px 0", fontSize: "0.88rem", fontWeight: 600 }}>
                      Join our active talent &amp; hiring WhatsApp Community:
                    </p>
                    <a
                      href="https://chat.whatsapp.com/LWswD7SeIf22btGoNETsLw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-whatsapp-success-btn"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.889-9.885 9.889m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>Join WhatsApp Community</span>
                    </a>
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
