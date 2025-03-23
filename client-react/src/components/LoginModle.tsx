import { useState } from "react";
import { Dialog, DialogContent, Tabs, Tab, Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; // אייקון סגירה
import Login from "./Login";
import Register from "./Register";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

function LoginModle({ open, onClose }: AuthModalProps) {
  const [tab, setTab] = useState(0);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.9)",
          border: "1px solid black",
          position: "relative",
          height: 500, // הגדרת גובה קבוע
        }}
      >
        {/* כפתור סגירה */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="התחברות" />
          <Tab label="הרשמה" />
        </Tabs>
        <Box mt={2} sx={{ heightn: 'calc(100% - 50px)', overflowY: 'auto' }}>
          {tab === 0 ? <Login closeModal={onClose} /> : <Register closeModal={onClose} />}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModle;
