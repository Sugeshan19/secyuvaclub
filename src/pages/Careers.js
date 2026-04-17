import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BorderGlow from "../components/BorderGlow";
import { applyForCareer } from "../services/careerService";
import { getMyMembership } from "../services/membershipService";
import "./careers.css";

const DOMAINS = [
  {
    name: "PUBLIC RELATIONS",
    tagline: "Build partnerships and represent YUVA with confidence.",
  },
  {
    name: "EDITORIAL",
    tagline: "Shape story direction and polish every release.",
  },
  {
    name: "PHOTOGRAPHY",
    tagline: "Capture moments that define campus culture.",
  },
  {
    name: "VIDEOGRAPHY",
    tagline: "Turn events into cinematic highlight reels.",
  },
  {
    name: "EDITING - Video",
    tagline: "Craft clean cuts, pacing, and final visual impact.",
  },
  {
    name: "STUDENT RELATIONS",
    tagline: "Connect teams, coordinate members, and drive engagement.",
  },
  {
    name: "CONTENT CREATOR",
    tagline: "Design scroll-stopping ideas for social platforms.",
  },
  {
    name: "CONTENT WRITER",
    tagline: "Write sharp copy for posts, scripts, and campaigns.",
  },
];

const DOMAIN_NAMES = DOMAINS.map((item) => item.name);

const Careers = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    year: "",
    department: "",
    domain: DOMAIN_NAMES[0],
    experience: "",
    portfolioLink: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canAccessCareers, setCanAccessCareers] = useState(false);

  useEffect(() => {
    const checkMembershipAccess = async () => {
      try {
        const membership = await getMyMembership();
        const isApproved = membership?.status === "approved";
        const isValid = membership?.validTill
          ? new Date(membership.validTill) >= new Date()
          : false;

        if (!isApproved || !isValid) {
          alert("Approved membership is required to access careers.");
          navigate("/membership", { replace: true });
          return;
        }

        setCanAccessCareers(true);
      } catch (err) {
        alert(err.message || "Please complete membership to access careers.");
        navigate("/membership", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkMembershipAccess();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDomainPick = (domain) => {
    setForm((prev) => ({ ...prev, domain }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await applyForCareer(form);
      alert("Application submitted successfully");
      setForm({
        name: "",
        email: "",
        phone: "",
        year: "",
        department: "",
        domain: DOMAIN_NAMES[0],
        experience: "",
        portfolioLink: "",
      });
    } catch (err) {
      alert(err.message || "Unable to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const glowColors = [
    ["#60a5fa", "#22d3ee", "#a78bfa"],
    ["#34d399", "#22d3ee", "#60a5fa"],
    ["#f472b6", "#38bdf8", "#818cf8"],
    ["#f59e0b", "#fbbf24", "#fde68a"],
    ["#60a5fa", "#8b5cf6", "#ec4899"],
    ["#22d3ee", "#34d399", "#60a5fa"],
    ["#fb7185", "#f97316", "#fbbf24"],
    ["#a78bfa", "#818cf8", "#60a5fa"],
  ];

  return (
    <>
      <Navbar />

      <main className="careers-page">
        {!canAccessCareers ? (
          <section className="careers-hero">
            <h1>{loading ? "Checking membership access..." : "Redirecting..."}</h1>
          </section>
        ) : (
          <>
        <section className="careers-hero">
          <p className="careers-kicker">YUVA Recruitment</p>
          <h1>Careers at YUVA Club - SEC </h1>
          <p className="careers-subtitle">
            Pick your lane, build your portfolio, and create impact with YUVA.
            Join the team that shapes campus stories and experiences.
          </p>
        </section>

        <section className="domains-section" aria-label="Career domains">
          <div className="domains-grid">
            {DOMAINS.map((domain, index) => (
              <BorderGlow
                className={`domain-card-glow ${form.domain === domain.name ? "selected" : ""}`}
                key={domain.name}
                backgroundColor="#111827"
                borderRadius={14}
                glowRadius={26}
                glowColor="210 80 70"
                colors={glowColors[index % glowColors.length]}
                onClick={() => handleDomainPick(domain.name)}
              >
                <article className="domain-card" style={{ animationDelay: `${index * 90}ms` }}>
                  <p className="domain-index">{String(index + 1).padStart(2, "0")}</p>
                  <h2>{domain.name}</h2>
                  <p className="domain-copy">{domain.tagline}</p>
                  <span className="domain-cta">Tap to select</span>
                </article>
              </BorderGlow>
            ))}
          </div>
        </section>

        <section className="careers-form-section" aria-label="Apply for careers">
          <div className="careers-form-card">
            <h3>Apply Now</h3>
            <p className="form-note">Selected domain: <strong>{form.domain}</strong></p>

            <form className="careers-form" onSubmit={handleSubmit}>
              <div className="careers-form-grid">
                <input
                  name="name"
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <input
                  name="phone"
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
                <input
                  name="year"
                  placeholder="Year (Eg: 2nd Year)"
                  value={form.year}
                  onChange={handleChange}
                />
                <input
                  name="department"
                  placeholder="Department"
                  value={form.department}
                  onChange={handleChange}
                />
                <select name="domain" value={form.domain} onChange={handleChange}>
                  {DOMAIN_NAMES.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                name="experience"
                placeholder="Tell us about your relevant experience"
                rows={4}
                value={form.experience}
                onChange={handleChange}
              />

              <input
                name="portfolioLink"
                placeholder="Portfolio / Drive / Instagram link (optional)"
                value={form.portfolioLink}
                onChange={handleChange}
              />

              <button type="submit" className="careers-submit-btn" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </section>

        <section className="careers-cta">
          <h3>Want to be part of this team?</h3>
          <p>
            Send your interest with a short intro to <strong>yiyuvasec@gmail.com</strong>
            and mention your preferred domain.
          </p>
          <a href="mailto:yiyuvasec@gmail.com?subject=YUVA%20Careers%20Application" className="careers-mail-btn">
            Apply by Email
          </a>
        </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Careers;
