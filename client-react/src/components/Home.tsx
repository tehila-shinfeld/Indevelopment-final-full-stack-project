import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import '../styleSheets/Home.css';
import LoginModal from "./LoginModle";
const Home = () => {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 50) {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box className="home-page">

      <div className="keep-meet">
        <h1>Keep-Meet</h1>
        <h3 className="keep">By Tehila Shinfeld 🏅
        </h3>
      </div>

      <div className="bottom-section">
        <Button
          className="styled-button"
          onClick={() => setOpen(true)}
        >
          GET STARTED
        </Button>
        <Typography className="styled-typography">
          KeepMeet – the summaries do it themselves! 📄✨<br />
          No more writing – the app summarizes every meeting for you, <br />
          highlights conclusions and keeps a neat record for the entire team. <br />
          Save time, always stay up to date, and let KeepMeet do the work! 🚀
        </Typography>
      </div>

      <LoginModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default Home;
