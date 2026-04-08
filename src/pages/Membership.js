import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./membership.css";
import {
  applyMembership,
  generateMembershipCard,
  getMyMembership,
} from "../services/membershipService";

const Membership = () => {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rollNo: "",
    dob: "",
    gender: "",
    scholarType: "",
    department: "",
    year: "",
    previousMember: "",
    aboutYuva: "",
    expectedBenefits: "",
    address: "Saveetha Engineering College, Chennai",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // =========================
  // FETCH MEMBERSHIP STATUS
  // =========================
  useEffect(() => {
    const loadMembership = async () => {
      try {
        const data = await getMyMembership();
        setMembership(data);
      } catch {
        setMembership(null);
      } finally {
        setLoading(false);
      }
    };

    loadMembership();
  }, []);

  // =========================
  // CHECK ACTIVE MEMBERSHIP
  // =========================
  const getStatusMeta = () => {
    if (!membership) {
      return { label: "Not Applied", className: "pending" };
    }

    if (membership.status === "approved") {
      return { label: "Approved", className: "approved" };
    }

    if (membership.status === "rejected") {
      return { label: "Rejected", className: "rejected" };
    }

    return { label: "Pending Approval", className: "pending" };
  };

  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await applyMembership(formData);
      setMembership(data.membership);
      alert("Application submitted. Waiting for admin approval.");
    } catch (err) {
      alert(err.message || "Membership submission failed");
    }
  };

  const handleGenerateCard = async () => {
    try {
      const data = await generateMembershipCard();
      window.open(`${process.env.REACT_APP_API_URL}${data.cardUrl}`, "_blank");
    } catch (err) {
      alert(err.message || "Unable to generate card");
    }
  };

  const statusMeta = getStatusMeta();

  return (
    <>
      <Navbar />

      <div className="membership-page">
        <div className="membership-wrapper">

          {/* HEADER */}
          <div className="membership-header">
            <h1>YUVA Membership Application</h1>
            <p>
              Join Saveetha Engineering College’s student community focused on
              leadership, innovation, and social impact.
            </p>
          </div>

          {/* FORM CARD */}
          <div className="membership-card">
            {loading ? (
              <p>Checking membership status...</p>
            ) : membership ? (
              <div className="already-member">
                <h2>Membership Application Status</h2>
                <span className={`membership-status ${statusMeta.className}`}>
                  {statusMeta.label}
                </span>

                <p>
                  <strong>Membership ID:</strong> {membership.membershipId}
                </p>
                <p>
                  <strong>Valid Till:</strong>{" "}
                  <strong>
                    {new Date(membership.validTill).toLocaleDateString()}
                  </strong>
                </p>

                {membership.status === "approved" ? (
                  <button className="submit-btn" onClick={handleGenerateCard}>
                    Generate / Download Membership Card
                  </button>
                ) : (
                  <p>Membership card will be available only after approval.</p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                {/* SECTION 1 */}
                <h3>Personal Details</h3>
                <div className="form-grid">
                  <input name="name" placeholder="Full Name *" required onChange={handleChange} />
                  <input name="email" type="email" placeholder="Email *" required onChange={handleChange} />
                  <input name="phone" placeholder="Phone Number *" required onChange={handleChange} />
                  <input name="rollNo" placeholder="Register Number *" required onChange={handleChange} />
                  <input name="dob" type="date" required onChange={handleChange} />
                  <select name="gender" required onChange={handleChange}>
                    <option value="">Gender *</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* SECTION 2 */}
                <h3>Academic Details</h3>
                <div className="form-grid">
                  <select name="scholarType" required onChange={handleChange}>
                    <option value="">Hosteller / Day Scholar *</option>
                    <option>Hosteller</option>
                    <option>Day Scholar</option>
                  </select>

                  <select name="department" required onChange={handleChange}>
                    <option value="">Department *</option>
                    <option>Computer Science and Engineering</option>
                    <option>Information Technology</option>
                    <option>Electronics and Communication Engineering</option>
                    <option>Mechanical Engineering</option>
                    <option>Electrical and Electronics Engineering</option>
                    <option>Artificial Intelligence and Machine Learning</option>
                    <option>Artificial Intelligence and Data Science</option>
                    <option>Biomedical Engineering</option>
                    <option>Chemical Engineering</option>
                    <option>Civil Engineering</option>
                    <option>Management Studies</option>
                    <option>Agricultural Engineering</option>
                  </select>

                  <select name="year" required onChange={handleChange}>
                    <option value="">Year *</option>
                    <option>First Year</option>
                    <option>Second Year</option>
                    <option>Third Year</option>
                    <option>Final Year</option>
                  </select>
                </div>

                {/* SECTION 3 */}
                <h3>About You & YUVA</h3>
                <div className="form-grid single">
                  <select name="previousMember" required onChange={handleChange}>
                    <option value="">Previous YUVA Member? *</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>

                  <textarea
                    name="aboutYuva"
                    placeholder="What do you know about YUVA? *"
                    required
                    onChange={handleChange}
                  />

                  <textarea
                    name="expectedBenefits"
                    placeholder="What do you expect from this membership? *"
                    required
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Submit Membership Application
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Membership;
