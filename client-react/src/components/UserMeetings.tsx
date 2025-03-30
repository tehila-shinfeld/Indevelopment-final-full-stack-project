import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardContent, Typography, CircularProgress, Container, Grid,
  Switch, Drawer, List, ListItem, ListItemText, IconButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { motion } from "framer-motion";
import "../styleSheets/UserMeetings.css";
import { useNavigate } from "react-router-dom";

const UserMeetings = () => {
  interface Meeting {
    id: number;
    name: string;
    summaryContent: string;
  }

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleDrawer = (open: boolean) => setMenuOpen(open);
  const navigate = useNavigate();

  return (
    // <Container className={darkMode ? "dark-mode" : ""}>
    <Container className="">

      <IconButton onClick={() => toggleDrawer(true)} className="menu-button">
        <MenuIcon fontSize="large" />
      </IconButton>

      <Drawer anchor="left" open={menuOpen} onClose={() => toggleDrawer(false)}>
        <List className="sidebar">
          <ListItem component="button" onClick={() => alert("האפשרות בתהליך פיתוח ותיפתח בקרוב 😋....")}>
            <ListItemText primary="👤 פרופיל שלי" />
          </ListItem>
          <ListItem component="button" onClick={() => navigate("/summary-up!")}>
            <ListItemText primary="➕ הוספת ישיבה" />
          </ListItem>
          <ListItem component="button" onClick={() => toggleDrawer(false)}>
            <ListItemText primary="📅 כל הישיבות שלי" />
          </ListItem>
        </List>
      </Drawer>

      {/* <div className="dark-mode-toggle">
        <Typography variant="body1">🌙 מצב כהה</Typography>
        <Switch checked={darkMode} onChange={toggleDarkMode} />
      </div> */}

      <Typography variant="h4" gutterBottom className="title">
        סיכומי הישיבות שלי
      </Typography>

      {loading ? (
        <div className="loading-container">
          <CircularProgress style={{ height: '80px', width: '80px', color: 'rgb(91, 140, 155)',marginTop:'100px' }} />
        </div>)
        : error ? (
          <Typography color="error" className="error">
            {error}
          </Typography>
        ) : meetings.length === 0 ? (
          <Typography className="no-data">אין לך סיכומים כרגע.</Typography>
        ) : (
          <Grid container spacing={3}>
            {meetings.map((meeting, index) => (
              <Grid item xs={12} sm={6} key={meeting.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
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
