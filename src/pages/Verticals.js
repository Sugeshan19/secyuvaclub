import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BorderGlow from "../components/BorderGlow";
import "./verticals.css";

const Verticals = () => {
  const verticals = [
    {
      id: 1,
      name: "Health",
      description: "",
      icon: "/images/health.png"
    },
    {
      id: 2,
      name: "Entrepreneurship",
      description: "",
      icon: "/images/enterprenurship.png"
    },
    {
      id: 3,
      name: "Innovation",
      description: "",
      icon: "/images/innovation.png"
    },
    {
      id: 4,
      name: "ACCESSIBILITY ",
      description: "",
      icon: "/images/accessibility.png"
    },
    {
      id: 5,
      name: "SPORTS",
      description: "",
      icon: "/images/sports.png"
    },
    {
      id: 6,
      name: "MASOOM",
      description: "",
      icon: "/images/masoom.png"
    },
    {
      id: 7,
      name: "ROAD SAFETY",
      description: "",
      icon: "/images/roadsafety.png"
    },
    {
      id: 8,
      name: "LEARNING",
      description: "",
      icon: "/images/learning.png"
    }
  ];

  return (
    <>
      <Navbar />

      <div className="verticals-page">
        {/* HERO */}
        <section className="verticals-hero-card">
          <h1>Our Verticals</h1>
          <p>
            Explore the different verticals that make up YUVA Club and find
            the one that resonates with you.
          </p>
        </section>

        {/* VERTICALS GRID */}
        <section className="verticals-grid">
            {verticals.map((vertical, index) => {
              const glowColors = [
                ['#60a5fa', '#22d3ee', '#a78bfa'],
                ['#34d399', '#22d3ee', '#60a5fa'],
                ['#f472b6', '#38bdf8', '#818cf8'],
                ['#f59e0b', '#fbbf24', '#fde68a'],
                ['#60a5fa', '#8b5cf6', '#ec4899'],
                ['#22d3ee', '#34d399', '#60a5fa'],
                ['#fb7185', '#f97316', '#fbbf24'],
                ['#a78bfa', '#818cf8', '#60a5fa'],
              ];

              return (
                <BorderGlow
                  key={vertical.id}
                  className="vertical-card-glow"
                  backgroundColor="#111827"
                  borderRadius={14}
                  glowRadius={26}
                  glowColor="210 80 70"
                  colors={glowColors[index]}
                >
                  <div className="vertical-card">
                    <div className="vertical-icon">
                      {vertical.id === 1 || vertical.id === 2 || vertical.id === 3 || vertical.id === 4 || vertical.id === 5 || vertical.id === 6 || vertical.id === 7 || vertical.id === 8 ? (
                        <img src={vertical.icon} alt={`${vertical.name} icon`} />
                      ) : (
                        vertical.icon
                      )}
                    </div>
                    <h3>{vertical.name}</h3>
                    <p>{vertical.description}</p>
                  </div>
                </BorderGlow>
              );
            })}
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Verticals;
