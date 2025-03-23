import React from "react";
import { Alert } from "@mui/material";
import "../styleSheets/FileUploadButton.css";

interface NotificationProps {
  message: string;
  type: "error" | "warning" | "info" | "success";
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  if (!message) return null; // אם אין הודעה, לא מציגים כלום

  return (
    <div className="notification-container">
      <Alert 
        severity={type} 
        className="notification-message" 
        onClose={onClose}
      >
        {message}
      </Alert>
    </div>
  );
};

export default Notification;
