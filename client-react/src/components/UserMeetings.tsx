import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, CircularProgress, Container, Grid, Switch } from "@mui/material";
import { motion } from "framer-motion"; // ✅ נוסיף את Framer Motion
import "../styleSheets/UserMeetings.css"; // ✅ נוסיף את ה-CSS שלנו

const UserMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);

    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`https://localhost:7136/api/files/get-user-meetings/9`);
        setMeetings(response.data);
      } catch (err) {
        setError("Failed to fetch meetings.");
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Container className={darkMode ? "dark-mode" : ""}>
      <div className="dark-mode-toggle">
        <Typography variant="body1">🌙 מצב כהה</Typography>
        <Switch checked={darkMode} onChange={toggleDarkMode} />
      </div>

      <Typography variant="h4" gutterBottom className="title">
        סיכומי הישיבות שלי
      </Typography>

      {loading ? (
        <CircularProgress className="loading" />
      ) : error ? (
        <Typography color="error" className="error">
          {error}
        </Typography>
      ) : meetings.length === 0 ? (
        <Typography className="no-data">אין לך סיכומים כרגע.</Typography>
      ) : (
        <Grid container spacing={3}>
          {meetings.map((meeting, index) => (
            <Grid item xs={12} sm={6} md={4} key={meeting.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }} // ✅ אנימציה לכל כרטיס עם השהיה שונה
              >
                <Card className="meeting-card">
                  <CardContent>
                    <Typography variant="h6">{meeting.name}</Typography>
                    <Typography variant="body2" className="summary">{meeting.summaryContent}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default UserMeetings;
