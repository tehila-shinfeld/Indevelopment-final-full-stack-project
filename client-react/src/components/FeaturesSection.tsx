import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import "../styleSheets/features.css";

const FeaturesSection = () => {
  const features = [
    {
      title: "AI שמבין אותך",
      desc: "המערכת יודעת לזהות רעיונות מרכזיים, החלטות ומשימות מתוך טקסט של פגישה.",
      icon: "🧠",
    },
    {
      title: "סיכום בלחיצת כפתור",
      desc: "העלו תמלול – וקבלו תקציר ברור, קצר וענייני לשיתוף עם הצוות.",
      icon: "⚡",
    },
    {
      title: "הכל מתועד",
      desc: "אין יותר ״מה סיכמנו?״ – כל פגישה מתועדת, זמינה ומאורגנת.",
      icon: "🗂️",
    },
    {
      title: "תמיכה מלאה בעברית",
      desc: "האפליקציה יודעת לעבוד עם תמלולים בעברית – כולל שפה עסקית או טכנית.",
      icon: "🇮🇱",
    },
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const iconControls = features.map(() => useAnimation());
  const cardControls = useAnimation();

  useEffect(() => {
    if (inView) {
      cardControls.start("visible");

      iconControls.forEach((control, idx) => {
        control.start("visible");

        setTimeout(() => {
          control.stop(); // עוצר את האנימציה אחרי 20 שניות
        }, 20000); // 20 שניות
      });
    }
  }, [inView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3 },
    }),
  };

  const iconVariants = [
    {
      hidden: { rotate: 0, opacity: 0 },
      visible: {
        rotate: [0, 25, -25, 10, -10, 0],
        opacity: 1,
        transition: { duration: 4, ease: "easeInOut" }, // מהירות האנימציה
      },
    },
    {
      hidden: { scale: 0, opacity: 0 },
      visible: {
        scale: [1, 1.5, 1, 1.3, 1],
        opacity: 1,
        transition: { duration: 4, ease: "easeInOut" }, // מהירות האנימציה
      },
    },
    {
      hidden: { y: -40, opacity: 0 },
      visible: {
        y: [-40, 15, -15, 8, 0],
        opacity: 1,
        transition: { duration: 4, ease: "easeOut" }, // מהירות האנימציה
      },
    },
    {
      hidden: { x: -40, opacity: 0 },
      visible: {
        x: [-40, 20, -20, 10, 0],
        opacity: 1,
        transition: { duration: 4, ease: "easeOut" }, // מהירות האנימציה
      },
    },
  ];

  return (
    <section className="features-section" ref={ref}>
      <motion.h2
        className="features-title"
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        למה TalkToMe<span className="highlight">.AI</span>?
      </motion.h2>

      <div className="features-grid">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            className="feature-card"
            custom={idx}
            initial="hidden"
            animate={cardControls}
            variants={cardVariants}
          >
            <motion.div
              className="feature-icon glowing-icon"
              initial="hidden"
              animate={iconControls[idx]}
              variants={iconVariants[idx % iconVariants.length]}
            >
              {feature.icon}
            </motion.div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
export default FeaturesSection;
