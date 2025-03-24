import { Alert, Button, Card, CircularProgress, IconButton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Notification from "./Notification";
import "../styleSheets/FileUploadButton.css";
import { useSummary } from "./context/SummaryContext";

const FileUploadButton: React.FC<{ onFileUpload: (url: string) => void }> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const { setSummary } = useSummary();

  useEffect(() => {
    console.log("📡 fileUrl התעדכן:", fileUrl);
    
  }, [fileUrl]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (selectedFile: File) => {
    setUploading(true);
    setFile(selectedFile);
    try {
      console.log("שליחת שם הקובץ לשרת לקבלת Presigned URL");
      const response1 = await axios.post("https://localhost:7136/api/files/upload", {
        fileName: selectedFile.name,
      });
      console.log(" res", response1);
      const { fileId, fileUrl } = response1.data;
      setFileUrl(fileUrl);
      onFileUpload(fileUrl); // 📡 מעדכן את הקומפוננטה שמעל

      const response2 = await axios.put(fileUrl, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
      });
      console.log("up!!", response2);
      setMessage(`✅ The file was uploaded successfully! ID: ${fileId}`);

    } catch (error) {
      console.error("שגיאה בהעלאת הקובץ:", error);
      setMessage("❌ שגיאה בהעלאה, נסה שוב.");
    } finally {
      setUploading(false);
      setDragging(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    if (event.target.files && event.target.files.length > 0) {
      handleFileUpload(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleSummarize = async () => {
    console.log("try....");
    
    if (!fileUrl) {
      alert("No file URL provided!");
      return;
    }

    setLoading(true);
    try {
      console.log("try....in");

      const response = await fetch("https://localhost:7136/api/files/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fileUrl), // שולח את ה-URL ישירות לפי הגדרת ה-API שלך
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }
      console.log("try....inin");

      const data = await response.json();
      setSummary(data.summary);
      
    } catch (error) {
      console.error("Error:", error);
      alert("Error fetching summary");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length > 0) {
      handleFileUpload(event.dataTransfer.files[0]);
    }
  };

  return (


    <div className="container">
      <div className="allContent">
        <Card
          className="uploadCard"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}>
          <div className="all">
            <Typography id="title" variant="h5" component="div" className="upload-title">
              Upload a file!
            </Typography>

            <div className="typing-container">
              <Typography variant="body2" color="text.secondary" className="upload-instructions">
                <span className="typing-line">Choose a PDF or TXT file from your computer</span>
                <span className="typing-line">Drag and drop here or click to upload</span>
                <span className="typing-line">Maximum size: 5MB</span>
              </Typography>

            </div>

            <div
              className={`dropzone ${dragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Typography variant="body2" className="upload-instructions">
                <span >📂 Drag & Drop a PDF or TXT file here</span>
                <span >or Click to upload</span>
              </Typography>
            </div>

            <div className="upload-button-container">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <IconButton
                id="iconUp"
                color="primary"
                onClick={handleButtonClick}
                sx={{
                  width: 50,
                  height: 50,
                  border: "1px solid black",
                  backgroundColor: 'white',
                  '&:hover': { backgroundColor: 'ButtonFace' },
                  transition: '0.3s',
                }}
              >
                <AddIcon />
              </IconButton>

              {uploading && (
                <div id="circle">
                  <CircularProgress size={80} />
                </div>
              )}

              <Notification
                message={message}
                type={"info"}
                onClose={() => setMessage("")}
              />
            </div>
          </div>
        </Card>


      </div>
      <Button
        id="summaryButton"
        variant="contained"
        color="primary"
        onClick={handleSummarize}
      >
        Summary Up!
      </Button>
    </div>
  );
};

export default FileUploadButton;
