import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardContent, Typography, CircularProgress, Container, Grid,
  Switch, Drawer, List, ListItem, ListItemText, IconButton,
  TextField,
  Button
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
    summaryDate: Date;
  }
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const toggleDrawer = (open: boolean) => setMenuOpen(open);
  const navigate = useNavigate();
  const resetSearch = () => {
    setSearchName("");
    setSearchDate("");
  };
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow", fontWeight: "bold" }}>{part}</span>
      ) : (
        part
      )
    );
  };
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesName = meeting.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesDate = searchDate
      ? new Date(meeting.summaryDate).toISOString().split("T")[0] === searchDate
      : true;
    return matchesName && matchesDate;
  });
  useEffect(() => {
    // שליפת המישתמש מהקונטקסט

    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`https://localhost:7136/api/files/get-user-meetings/9`);
        setMeetings(response.data);
      } catch (err) {
        setError("שגיאה בטעינת המשימות");
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);



  return (
    <Container className="">
      {/* תפריט צדדי לניווט */}
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

      {/* הצגת סיכומי הישיבות */}
      <Typography variant="h4" gutterBottom className="title">
        סיכומי הישיבות שלי
      </Typography>
      {/* חיפוש */}
      <Grid container spacing={2} className="search-bar">
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="חיפוש לפי שם"
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Grid item xs={12} sm={12} style={{ textAlign: "left" }}>
            <Button variant="outlined" onClick={resetSearch}>
              איפוס חיפוש
            </Button>
          </Grid>
        </Grid>
        {<Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="תאריך"
            InputLabelProps={{ shrink: true }}
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </Grid>}
      </Grid>

      {loading ? (
        <div className="loading-container">
          <CircularProgress style={{ height: '80px', width: '80px', color: 'rgb(91, 140, 155)', marginTop: '100px' }} />
        </div>)
        : error ? (
          <Typography color="error" className="error">
            {error}
          </Typography>
        ) : meetings.length === 0 ? (
          <Typography className="no-data">אין לך סיכומים כרגע.</Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredMeetings.map((meeting, index) => (
              <Grid item xs={12} sm={6} key={meeting.id}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="meeting-card">
                    <CardContent>
                      <Typography variant="h6">
                        {highlightMatch(meeting.name, searchName)}
                      </Typography> 
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
