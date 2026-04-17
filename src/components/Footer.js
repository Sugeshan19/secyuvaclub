import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <h3>YUVA Club</h3>
          <p>
            YUVA at Saveetha Engineering College is a student-led chapter bridging
            industry, academia, and society through leadership, innovation, and
            social impact.
          </p>
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/membership">Membership</Link>
          <Link to="/profile">Profile</Link>

          {/* FAQ — footer only */}
          <Link to="/faq">FAQ</Link>
        </div>

        {/* CONTACT */}
        <div className="footer-links">
          <h4>Contact</h4>
          <p>Saveetha Engineering College</p>
          <p>Chennai, Tamil Nadu</p>
          <p>yiyuvasec@gmail.com</p>
          <a
            href="https://www.instagram.com/yuvaclub_sec?igsh=MnY1emJwOTJpcXM3"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>

        {/* CREDITS */}
        <div className="footer-links">
          <h4>Branding & Tech</h4>
          <a
            href="https://sugeshan-s.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            Sugeshan S – Full Stack (MERN)
          </a>
          <p>Arshiya M – Frontend</p>
          <p>Nithyasree S – Frontend</p>
          <p>Keshavardhini B – UI/UX</p>
          <p>Esakindar – UI/UX</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} YUVA Club · Saveetha Engineering College
      </div>
    </footer>
  );
};

export default Footer;
