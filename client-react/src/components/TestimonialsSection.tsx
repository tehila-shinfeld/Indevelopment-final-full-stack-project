import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import "../styleSheets/testimonials.css";

const testimonials = [
  {
    name: "דניאל לוי",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    message: "המערכת שינתה לנו את הדרך בה אנחנו מסכמים פגישות – לא חוזרים יותר אחורה!",
    side: "left",
  },
  {
    name: "שרה כהן",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    message: "פשוט וואו. העליתי תמלול וקיבלתי סיכום מדויק ואיכותי.",
    side: "right",
  },
  {
    name: "נועם פרידמן",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    message: "TalkToMe.AI עוזר לי לסדר את כל הישיבות במקום אחד. תענוג!",
    side: "left",
  },
];

// פונקציה שמחזירה את זמן ההקלדה של הודעה (ms)
const calculateTypingDuration = (message: string | any[], speed = 30) => message.length * speed;

const TestimonialBubble = ({ t, index, startTime, inView }: { t: typeof testimonials[0]; index: number; startTime: number; inView: boolean }) => {
  const [typedText, setTypedText] = useState("");
  const [startedTyping, setStartedTyping] = useState(false);

  useEffect(() => {
    if (inView && !startedTyping) {
      const typingSpeed = 30;

      const timeout = setTimeout(() => {
        setStartedTyping(true);
        let i = 0;
        const interval = setInterval(() => {
          setTypedText((prev) => prev + t.message.charAt(i));
          i++;
          if (i === t.message.length) clearInterval(interval);
        }, typingSpeed);
      }, startTime);

      return () => clearTimeout(timeout);
    }
  }, [inView]);

  return (
    <motion.div
      className={`chat-bubble ${t.side}`}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.9,
        ease: "easeOut",
        delay: startTime / 1000, // תיאום עם התחלה
      }}
    >
      <img src={t.image} alt={`תמונה של ${t.name}`} className="user-image" />
      <div className="bubble-content">
        <p className="message" dir="rtl" style={{ textAlign: "right" }}>
          {typedText}
        </p>
        {/* <span className="name">— {t.name}</span> */}
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  let accumulatedDelay = 0;
  const delays = testimonials.map((t) => {
    const current = accumulatedDelay;
    accumulatedDelay += calculateTypingDuration(t.message) + 500; // כולל פאוזה
    return current;
  });

  return (
    <section className="testimonials-section" ref={ref}>
      <motion.h2
        className="testimonials-title"
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        מה אומרים על <span className="highlight">TalkToMe.AI</span>?
      </motion.h2>

      <div className="chat-container">
        {testimonials.map((t, index) => (
          <TestimonialBubble
            key={index}
            t={t}
            index={index}
            startTime={delays[index]}
            inView={inView}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
