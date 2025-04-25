
// HowItWorksSteps.tsx
import "../styleSheets/HowItWorksSection.css";

const steps = [
  {
    number: 1,
    title: "העלו תמלול",
    desc: "בחרו קובץ או העתקו את הטקסט מהפגישה.",
  },
  {
    number: 2,
    title: "קבלו סיכום ברור",
    desc: "ה-AI מנתח, מסכם ומבליט עיקרי דברים.",
  },
  {
    number: 3,
    title: "שתפו את הצוות",
    desc: "שיתוף פשוט של הסיכום בפורמט מסודר.",
  },
];

export default function HowItWorksSteps() {
  return (
    <section className="how-it-works-steps">
      <h2 className="steps-title">איך זה עובד?</h2>
      
      <div className="steps-wrapper">
        {steps.map((step) => (
          <div key={step.number} className="step-item">
            <div className="circle-number">{step.number}</div>
            <div className="step-text">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
