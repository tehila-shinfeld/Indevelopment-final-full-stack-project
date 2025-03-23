import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import FileUploadButton from "./FileUploadButton";
import SummarizeFile from "./SummarizeFile";
import "../styleSheets/MainScreen.css"; // ✅ ייבוא העיצוב מה-CSS

const MainScreen = () => {
  return (
    <div id="content">
      <div id="main">
        {/* כרטיס העלאת קובץ */}
        <Card className="upload-card">
          <CardContent >
            {/* כותרת */}
            <Typography variant="h5" component="div" className="upload-title">
              Upload a file!
            </Typography>

            {/* הוראות העלאת קובץ */}
            <div className="typing-container">
              <Typography variant="body2" color="text.secondary" className="upload-instructions">
                <span className="typing-line">Choose a PDF or TXT file from your computer</span>
                <span className="typing-line">Drag and drop here or click to upload</span>
                <span className="typing-line">Maximum size: 5MB</span>
              </Typography>
            </div>

            {/* כפתור העלאה */}
            <div className="upload-button-container">
              <FileUploadButton />
            </div>
          </CardContent>
        </Card>

        {/* כרטיס סיכום */}
        <Card className="upload-card">
          <SummarizeFile fileUrl={"s3Url"} />
        </Card>
      </div>
    </div>
  );
};

export default MainScreen;
