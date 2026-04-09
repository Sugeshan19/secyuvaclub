import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getGalleryImages } from "../services/galleryService";
import "./gallery.css";

const SECTION_META = {
  womensday: {
    title: "Women's Day Celebration",
    description: "All uploaded images from Women's Day activities.",
  },
  meetings: {
    title: "YUVA Meetings",
    description: "Meeting highlights and snapshots.",
  },
  "mental-health-awareness": {
    title: "Mental Health Awareness Programme",
    description: "Highlights from awareness programme activities.",
  },
  general: {
    title: "General Gallery",
    description: "Other YUVA moments and milestones.",
  },
};

const toCategoryTitle = (category) =>
  String(category || "general")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "General";

const toOptimizedCloudinaryUrl = (url) => {
  if (!url || !url.includes("/image/upload/")) return url;
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await getGalleryImages();
        setImages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const sections = useMemo(() => {
    const grouped = {};

    images.forEach((image) => {
      const category = image.category || "general";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(image);
    });

    return Object.entries(grouped).map(([key, sectionImages]) => ({
      key,
      title: SECTION_META[key]?.title || toCategoryTitle(key),
      description:
        SECTION_META[key]?.description ||
        `${toCategoryTitle(key)} highlights from YUVA activities.`,
      images: sectionImages,
    }));
  }, [images]);

  return (
    <>
      <Navbar />

      <main className="gallery-page">
        <section className="gallery-hero">
          <h1>YUVA Gallery</h1>
          <p>Moments, memories, and milestones from YUVA activities.</p>
        </section>

        {loading ? (
          <section className="gallery-empty">
            <h3>Loading gallery...</h3>
          </section>
        ) : sections.every((section) => section.images.length === 0) ? (
          <section className="gallery-empty">
            <h3>No gallery images yet</h3>
            <p>Admin can now add images directly from the dashboard.</p>
          </section>
        ) : (
          sections.map((section) => (
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
                  {section.images.map((image, index) => (
                    <article className="gallery-item" key={image._id || `${section.key}-${index}`}>
                      <img
                        src={toOptimizedCloudinaryUrl(image.imageUrl)}
                        alt={image.title || `${section.title} ${index + 1}`}
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
