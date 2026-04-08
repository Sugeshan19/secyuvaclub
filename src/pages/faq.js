import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./faq.css";

const faqs = [
  {
    question: "What is YUVANXT?",
    answer:
      "YUVANXT is the name of our club’s membership drive. Derived from “Yuva,” meaning youth, and “NXT,” symbolizing the next generation and forward movement, it reflects our commitment to empowering young minds and shaping the future.",
  },
  {
    question: "What kinds of initiatives does YUVA do?",
    answer:
      "YUVA undertakes initiatives focused on community welfare, social awareness, and compassionate outreach, providing support and assistance to individuals and groups in need.",
  },
  {
    question: "How long does the YUVA membership remain valid?",
    answer:
      "The YUVA membership remains valid until 15 October 2026, covering the full duration of the current academic year.",
  },
  {
    question: "Can I give suggestions even if I'm not a core member?",
    answer:
      "Yes. All members are welcome to share ideas, participate in events, and actively contribute to the club’s activities.",
  },
  {
    question: "How will updates and announcements be shared?",
    answer:
      "Members are added to the official club group where all updates, announcements, and event details are shared regularly.",
  },
  {
    question: "Will YUVA organize external events?",
    answer:
      "Yes. YUVA organizes and participates in external events, providing members with broader exposure beyond campus activities.",
  },
  {
    question: "What is a Networking Session?",
    answer:
      "A networking session is an interactive event where members engage with peers and professionals to exchange ideas and build meaningful connections.",
  },
  {
    question: "Does YUVA conduct monthly idea exchange sessions?",
    answer:
      "Yes. Monthly idea exchange and networking sessions are conducted to encourage collaboration and innovation.",
  },
];

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) =>
    setActiveIndex(activeIndex === index ? null : index);

  return (
    <>
      <Navbar />

      <div className="faq-page">
        <div className="faq-wrapper">

          {/* HERO */}
          <div className="faq-hero">
            <h1>Frequently Asked Questions</h1>
            <p>
              Find answers to common questions about YUVA, membership, and our
              initiatives.
            </p>
          </div>

          {/* FAQ LIST */}
          <div className="faq-card">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className={`faq-question ${
                    activeIndex === index ? "active" : ""
                  }`}
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <span className="icon">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </button>

                {activeIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default FAQs;
