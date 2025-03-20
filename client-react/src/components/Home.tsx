import backgroundImage from "../images/i1.jpg";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import LoginModal from "./LoginModle";

// הגדרת רכיב ה-Background כסטיילד קומפוננט שמקבל את isOpen כפרופס
const Background = styled(Box)(({ isOpen }: { isOpen: boolean }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100vh",
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  zIndex: -1,
  transition: "0.3s ease",
  filter: isOpen ? "brightness(0.2)" : "brightness(1)", // שינוי בהירות לפי isOpen
}));

// הגדרת שאר רכיבי UI בעזרת styled
const ContentContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100vh",
  position: "relative",
  zIndex: 1,
});

const BottomSection = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "2rem",
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderTopLeftRadius: "30px",
  borderTopRightRadius: "30px",
});

const StyledButton = styled(Button)({
  padding: "1rem 2rem",
  fontSize: "1.2rem",
  fontWeight: "bold",
  borderRadius: "30px",
  background: "linear-gradient(135deg, #5a91bf, #1c3b5f)",
  color: "#fff",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  "&:hover": {
    background: "linear-gradient(135deg, #4a81af, #122b4f)",
  },
});

const Home = () => {
  const [open, setOpen] = useState(false); // מצב לפתיחת המודאל

  return (
    <Box position="relative">
      {/* העברת isOpen רק ל-Background */}
      <Background isOpen={open} />
      <ContentContainer>
        <Box flexGrow={1} />
        <BottomSection>
          <StyledButton variant="contained" onClick={() => setOpen(true)}>
            GET STARTED
          </StyledButton>
          <Typography
            variant="h5"
            sx={{
              maxWidth: "50%",
              color: "#f0f4f8",
              fontWeight: "bold",
              fontSize: "1.4rem",
            }}
          >
            חוויית ניהול פגישות שלא הכרתם – חכמה, חדשנית ומדויקת!
          </Typography>
        </BottomSection>
      </ContentContainer>

      {/* הפופ-אפ עם ה-LoginModal */}
      <LoginModal  open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default Home;
