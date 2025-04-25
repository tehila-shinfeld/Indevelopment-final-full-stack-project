import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import { FaRobot } from "react-icons/fa";
import '../styleSheets/HeroSection.css';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const  HeroSection=({ onGetStarted }: HeroSectionProps)=> {
  return (
    <section className="hero">
      <div className="hero-content">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          תנו ל־<span className="highlight-blue">בינה מלאכותית</span>  
          לסכם לכם את הפגישה
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          העלו תמלול – ותקבלו סיכום ברור, מקצועי ומוכן לשיתוף.  
          מושלם לצוותים, סטארטאפים, ולכל מי שלא אוהב לבזבז זמן.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Button
            variant="contained"
            onClick={onGetStarted}
            className="hero-btn"
            endIcon={<RocketLaunchIcon />}

          >
            התחילו עכשיו
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="hero-icon"
        initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <FaRobot size={160} color="var(--accent-blue)" />
      </motion.div>
    </section>
  );
}
export default HeroSection;