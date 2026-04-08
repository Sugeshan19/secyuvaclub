import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./gallery.css";

const WOMENSDAY_IMAGES = [
  "https://res.cloudinary.com/dtpl599ko/image/upload/v1775196212/IMG_0799_syeych.heic",
  "https://res.cloudinary.com/dtpl599ko/image/upload/v1775196211/IMG_0727_sswumy.heic",
  "https://res.cloudinary.com/dtpl599ko/image/upload/v1775196209/IMG_0768_kgc0ls.heic",
  "https://res.cloudinary.com/dtpl599ko/image/upload/v1775196199/IMG_0677_fb9uha.heic",
  "https://res.cloudinary.com/dtpl599ko/image/upload/v1775196197/WhatsApp_Image_2026-03-29_at_6.31.16_AM_qmhu1f.jpg",
  "https://res.cloudinary.com/dtpl599ko/image/upload/v1775196193/IMG_0822.JPG_fnwcgo.jpg",
  "https://res.cloudinary.com/dtpl599ko/image/upload/v1775196161/IMG_0761_vc6qfg.heic",
];

const YUVA_MEETING_IMAGES = [
  // Add meeting image URLs here.
];

const MENTAL_HEALTH_AWARENESS_IMAGES = [
  "https://res.cloudinary.com/dtpl599ko/image/upload/v1775198732/mentalhealth3_vfwh7p.jpg",
  "https://res.cloudinary.com/dtpl599ko/image/upload/v1775198732/mentalhealth1_mbxww2.jpg",
  "https://res.cloudinary.com/dtpl599ko/image/upload/v1775198732/mentalhealth2_pigrm3.jpg",
  "https://res.cloudinary.com/dtpl599ko/image/upload/v1775198732/mentalhealth4_xlfiid.jpg",
];

const GALLERY_SECTIONS = [
  {
    key: "womensday",
    title: "Women's Day Celebration",
    description: "All current uploaded images are listed here.",
    images: WOMENSDAY_IMAGES,
  },
  {
    key: "meetings",
    title: "YUVA Meetings",
    description: "Meeting images will appear here once added.",
    images: YUVA_MEETING_IMAGES,
  },
  {
    key: "mental-health-awareness",
    title: "Mental Health Awareness Programme",
    description: "Highlights from the awareness programme activities.",
    images: MENTAL_HEALTH_AWARENESS_IMAGES,
  },
];

const toOptimizedCloudinaryUrl = (url) => {
  if (!url.includes("/image/upload/")) return url;
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
};

const Gallery = () => {
  return (
    <>
      <Navbar />

      <main className="gallery-page">
        <section className="gallery-hero">
          <h1>YUVA Gallery</h1>
          <p>Moments, memories, and milestones from YUVA activities.</p>
        </section>

        {GALLERY_SECTIONS.every((section) => section.images.length === 0) ? (
          <section className="gallery-empty">
            <h3>No gallery images yet</h3>
            <p>
              Add your Cloudinary links in
              <strong> src/pages/Gallery.js</strong> inside
              <strong> WOMENSDAY_IMAGES</strong> or
              <strong> YUVA_MEETING_IMAGES</strong>.
            </p>
          </section>
        ) : (
          GALLERY_SECTIONS.map((section) => (
            <section className="gallery-section" key={section.key}>
              <div className="gallery-section-head">
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>

              {section.images.length === 0 ? (
                <div className="gallery-empty small">
                  <p>No images in this category yet.</p>
                </div>
              ) : (
                <div className="gallery-grid">
                  {section.images.map((imageUrl, index) => (
                    <article className="gallery-item" key={`${section.key}-${imageUrl}-${index}`}>
                      <img
                        src={toOptimizedCloudinaryUrl(imageUrl)}
                        alt={`${section.title} ${index + 1}`}
                        loading="lazy"
                      />
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))
        )}
      </main>

      <Footer />
    </>
  );
};

export default Gallery;
