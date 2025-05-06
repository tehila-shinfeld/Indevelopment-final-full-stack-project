// import React, { useState, useEffect } from "react";
// import { Box, Button, Typography } from "@mui/material";
import '../styleSheets/Home.css';
// import LoginModal from "./LoginModle";
// const Home = () => {
//   const [open, setOpen] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const handleScroll = () => {
//     const scrollPosition = window.scrollY;
//     if (scrollPosition > 50) {
//       setIsVisible(true);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <Box className="home-page">

//       <div className="keep-meet">
//         <h1>Keep-Meet</h1>
//         <h3 className="keep">By Tehila Shinfeld 🏅
//         </h3>
//       </div>

//       <div className="bottom-section">
//         <Button
//           className="styled-button"
//           onClick={() => setOpen(true)}
//         >
//           GET STARTED
//         </Button>
//         <Typography className="styled-typography">
//           KeepMeet – the summaries do it themselves! 📄✨<br />
//           No more writing – the app summarizes every meeting for you, <br />
//           highlights conclusions and keeps a neat record for the entire team. <br />
//           Save time, always stay up to date, and let KeepMeet do the work! 🚀
//         </Typography>
//       </div>

//       <LoginModal open={open} onClose={() => setOpen(false)} />
//     </Box>
//   );
// };

// export default Home;
import FeaturesSection from "./FeaturesSection";
import { useState } from 'react';
import LoginModal from "./LoginModle";
import TestimonialsSection from './TestimonialsSection';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
// import FinalCTA from './FinalCTA';
export default function Home() {
  const [open, setOpen] = useState(false); // מצב לפתיחת המודאל

  return (
    <div className="landing-page">
      {/* <div className='title'>
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="landing-title"
        >
          TalkToMe<span className="highlight">.AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="landing-subtitle"
        >
          העלו את <span className="accent">תמלול הפגישה</span> – וה-AI שלנו יסכם אותה בשבילכם, ברור, ממוקד ומוכן לשיתוף.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <button onClick={() => setOpen(true)}
            className="get-started-btn">התחילו עכשיו</button>
        </motion.div>
      </div> */}
      <HeroSection onGetStarted={() => setOpen(true)} />
      <HowItWorksSection></HowItWorksSection>
      <LoginModal open={open} onClose={() => setOpen(false)} />
      <FeaturesSection />
      <TestimonialsSection></TestimonialsSection>
      {/* <FinalCTA></FinalCTA> */}
    </div>


  );
}
