import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BorderGlow from "../components/BorderGlow";
import "./about.css";

const About = () => {
  return (
    <>
      <Navbar />

      <div className="about-page">

        {/* HERO */}
        <section className="about-hero-card">
          <h1>About YUVA Club</h1>
          <p>
            Empowering students to become leaders, innovators, and responsible
            citizens through meaningful engagement and development programs.
          </p>
        </section>

        {/* INFO CARDS */}
        <section className="about-info-grid">
          <BorderGlow className="info-card-glow" backgroundColor="#111827" borderRadius={14} glowRadius={26} glowColor="210 80 70" colors={['#60a5fa', '#22d3ee', '#a78bfa']}>
            <div className="info-card">
              <h3>Why YUVA?</h3>
              <p>
                YUVA is the student-centric vertical of Young Indians (Yi), part of
                the Confederation of Indian Industry (CII), designed to empower
                students to become responsible leaders and innovators.
              </p>
            </div>
          </BorderGlow>

          <BorderGlow className="info-card-glow" backgroundColor="#111827" borderRadius={14} glowRadius={26} glowColor="210 80 70" colors={['#38bdf8', '#818cf8', '#c084fc']}>
            <div className="info-card">
              <h3>One Bharat · One Spirit · One YUVA</h3>
              <p>
                Among 15+ YUVA Chapter Colleges in Chennai, Saveetha Engineering
                College stands as an active chapter committed to youth leadership
                and nation-building.
              </p>
            </div>
          </BorderGlow>

          <BorderGlow className="info-card-glow" backgroundColor="#111827" borderRadius={14} glowRadius={26} glowColor="210 80 70" colors={['#2dd4bf', '#22d3ee', '#60a5fa']}>
            <div className="info-card">
              <h3>YUVA at Saveetha Engineering College</h3>
              <p>
                A student-led chapter bridging industry, academia, and society,
                providing real-world exposure aligned with national priorities.
              </p>
            </div>
          </BorderGlow>

          <BorderGlow className="info-card-glow" backgroundColor="#111827" borderRadius={14} glowRadius={26} glowColor="210 80 70" colors={['#3b82f6', '#8b5cf6', '#ec4899']}>
            <div className="info-card">
              <h3>Our Vision</h3>
              <p>
                To create a generation of responsible, innovative, and socially
                conscious youth leaders aligned with the spirit of One Bharat,
                One Spirit.
              </p>
            </div>
          </BorderGlow>
        </section>

        {/* IMPACT */}
        <section className="about-section">
          <h2>Through YUVA, students are empowered to</h2>
          <div className="bullet-grid">
            <BorderGlow className="bullet-card-glow" backgroundColor="#111827" borderRadius={12} glowRadius={22} glowColor="205 85 72" colors={['#22d3ee', '#60a5fa', '#818cf8']}>
              <div className="bullet-card">Build leadership and teamwork skills</div>
            </BorderGlow>
            <BorderGlow className="bullet-card-glow" backgroundColor="#111827" borderRadius={12} glowRadius={22} glowColor="205 85 72" colors={['#34d399', '#22d3ee', '#60a5fa']}>
              <div className="bullet-card">Gain industry exposure and mentorship</div>
            </BorderGlow>
            <BorderGlow className="bullet-card-glow" backgroundColor="#111827" borderRadius={12} glowRadius={22} glowColor="205 85 72" colors={['#60a5fa', '#818cf8', '#a78bfa']}>
              <div className="bullet-card">Develop innovation capabilities</div>
            </BorderGlow>
            <BorderGlow className="bullet-card-glow" backgroundColor="#111827" borderRadius={12} glowRadius={22} glowColor="205 85 72" colors={['#2dd4bf', '#38bdf8', '#818cf8']}>
              <div className="bullet-card">Engage in social impact initiatives</div>
            </BorderGlow>
          </div>
        </section>

        <section className="about-section light">
          <h2>What Makes YUVA Unique?</h2>
          <div className="bullet-grid">
            <BorderGlow className="bullet-card-glow" backgroundColor="#111827" borderRadius={12} glowRadius={22} glowColor="205 85 72" colors={['#60a5fa', '#a78bfa', '#ec4899']}>
              <div className="bullet-card">
                <strong>Industry Integration</strong>
                <p>Direct access to Yi–CII leaders and initiatives.</p>
              </div>
            </BorderGlow>
            <BorderGlow className="bullet-card-glow" backgroundColor="#111827" borderRadius={12} glowRadius={22} glowColor="205 85 72" colors={['#38bdf8', '#22d3ee', '#34d399']}>
              <div className="bullet-card">
                <strong>Leadership with Purpose</strong>
                <p>Students lead projects addressing national challenges.</p>
              </div>
            </BorderGlow>
            <BorderGlow className="bullet-card-glow" backgroundColor="#111827" borderRadius={12} glowRadius={22} glowColor="205 85 72" colors={['#818cf8', '#a78bfa', '#c084fc']}>
              <div className="bullet-card">
                <strong>Experiential Learning</strong>
                <p>Hands-on programs and real-world engagement.</p>
              </div>
            </BorderGlow>
            <BorderGlow className="bullet-card-glow" backgroundColor="#111827" borderRadius={12} glowRadius={22} glowColor="205 85 72" colors={['#2dd4bf', '#38bdf8', '#60a5fa']}>
              <div className="bullet-card">
                <strong>Pan-India Network</strong>
                <p>Connected to Yi and YUVA chapters across India.</p>
              </div>
            </BorderGlow>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Commitment at Saveetha Engineering College</h2>
          <div className="bullet-grid">
            <BorderGlow className="bullet-card-glow" backgroundColor="#111827" borderRadius={12} glowRadius={22} glowColor="205 85 72" colors={['#60a5fa', '#22d3ee', '#34d399']}>
              <div className="bullet-card">Ethical & inclusive leadership</div>
            </BorderGlow>
            <BorderGlow className="bullet-card-glow" backgroundColor="#111827" borderRadius={12} glowRadius={22} glowColor="205 85 72" colors={['#38bdf8', '#818cf8', '#a78bfa']}>
              <div className="bullet-card">Innovation & entrepreneurship</div>
            </BorderGlow>
            <BorderGlow className="bullet-card-glow" backgroundColor="#111827" borderRadius={12} glowRadius={22} glowColor="205 85 72" colors={['#2dd4bf', '#22d3ee', '#60a5fa']}>
              <div className="bullet-card">Community-driven initiatives</div>
            </BorderGlow>
            <BorderGlow className="bullet-card-glow" backgroundColor="#111827" borderRadius={12} glowRadius={22} glowColor="205 85 72" colors={['#818cf8', '#60a5fa', '#38bdf8']}>
              <div className="bullet-card">Future-ready student leaders</div>
            </BorderGlow>
          </div>
        </section>

        {/* PEOPLE */}
        <section className="team-section">
          <h2>Nodal Officer</h2>
          <div className="team-grid single">
            <BorderGlow className="team-card-glow" backgroundColor="#1e293b" borderRadius={14} glowRadius={30} glowColor="200 80 60" colors={['#f59e0b', '#fbbf24', '#fcd34d']}>
              <div className="team-card-inner"><img src="/images/nodal.png" alt="Nodal Officer" /><h4>Manimaran G</h4><p>SEC CII–Yi YUVA Chapter · Nodal Officer</p></div>
            </BorderGlow>
          </div>
        </section>

        <section className="team-section">
          <h2>Leadership Team</h2>
          <div className="team-grid leadership-grid">
            <BorderGlow className="team-card-glow" backgroundColor="#1e293b" borderRadius={14} glowRadius={30} glowColor="200 80 60" colors={['#8b5cf6', '#c084fc', '#e9d5ff']}>
              <div className="team-card-inner"><img src="/images/yugi.png" alt="Chair" /><h4>Yuganthiran P S</h4><p>Chair · YUVA</p></div>
            </BorderGlow>
            <BorderGlow className="team-card-glow" backgroundColor="#1e293b" borderRadius={14} glowRadius={30} glowColor="200 80 60" colors={['#06b6d4', '#06b6d4', '#cffafe']}>
              <div className="team-card-inner"><img src="/images/Sudhishna.png" alt="Co Chair" /><h4>Sudhishna P</h4><p>Co-Chair · YUVA</p></div>
            </BorderGlow>
          </div>
        </section>

        <section className="team-section light">
          <h2>Branding & Tech Team</h2>
          <div className="team-grid branding-team">
            <BorderGlow className="team-card-glow" backgroundColor="#1e293b" borderRadius={14} glowRadius={30} glowColor="200 80 60" colors={['#3b82f6', '#60a5fa', '#93c5fd']}>
              <div className="team-card-inner"><img src="/images/me.png" alt="" /><h4>Sugeshan S</h4><p>Backend · MERN</p></div>
            </BorderGlow>
            <BorderGlow className="team-card-glow" backgroundColor="#1e293b" borderRadius={14} glowRadius={30} glowColor="200 80 60" colors={['#ec4899', '#f472b6', '#fbcfe8']}>
              <div className="team-card-inner"><img src="/images/arshiya.png" alt="" /><h4>Arshiya M</h4><p>Frontend</p></div>
            </BorderGlow>
            <BorderGlow className="team-card-glow" backgroundColor="#1e293b" borderRadius={14} glowRadius={30} glowColor="200 80 60" colors={['#10b981', '#34d399', '#86efac']}>
              <div className="team-card-inner"><img src="/images/nithya.png" alt="" /><h4>Nithyasree S</h4><p>Frontend</p></div>
            </BorderGlow>
            <BorderGlow className="team-card-glow" backgroundColor="#1e293b" borderRadius={14} glowRadius={30} glowColor="200 80 60" colors={['#f97316', '#fb923c', '#fed7aa']}>
              <div className="team-card-inner"><img src="/images/esakindhar.png" alt="" /><h4>Esakindar</h4><p>UI/UX</p></div>
            </BorderGlow>
            <BorderGlow className="team-card-glow" backgroundColor="#1e293b" borderRadius={14} glowRadius={30} glowColor="200 80 60" colors={['#a855f7', '#d8b4fe', '#f3e8ff']}>
              <div className="team-card-inner"><img src="/images/kesha.png" alt="" /><h4>Keshavardhini B</h4><p>UI/UX</p></div>
            </BorderGlow>
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
};

export default About;
