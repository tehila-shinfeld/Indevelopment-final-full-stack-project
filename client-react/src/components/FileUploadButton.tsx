import { Alert, Button, Card, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useRef, useState } from "react";
import axios from "axios"; // ייבוא axios לשליחת בקשות API
import { CircularProgress } from "@mui/material";
import Notification from "./Notification"
import "../styleSheets/FileUploadButton.css";

const FileUploadButton: React.FC = () => {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [s3Url, sets3Url] = useState("t");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [fileUrl, setfilrUrl] = useState<string | null>("");
  const [summary, setSummary] = useState<string | null>("null");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("📡 s3Url התעדכן:", s3Url);
  }, [s3Url]);
  useEffect(() => {
    console.log("📡 fileUrl התעדכן:", fileUrl);
  }, [fileUrl]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setUploading(true); // התחלת אנימציה

      console.log(`📂 קובץ שנבחר: ${selectedFile.name}, גודל: ${selectedFile.size} בייטים, סוג: ${selectedFile.type}`);
      setFile(selectedFile); // מעדכנים את state עם הקובץ שנבחר

      // 2️⃣ שליחת בקשה לשרת לקבלת Presigned URL
      try {
        console.log("שליחת שם הקובץ לשרת לקבלת Presigned URL");

        // שליחת שם הקובץ לשרת לקבלת Presigned URL
        const response1 = await axios.post("https://localhost:7136/api/files/upload", {
          fileName: selectedFile.name,
        });

        console.log(" res", response1);
        const { fileId, fileUrl, s3Url } = response1.data;
        setFile(fileUrl);
        sets3Url(s3Url);
        // 3️⃣ העלאה ישירה ל-S3 בעזרת ה-Presigned URL
        setUploading(true);
        const response2 = await axios.put(fileUrl, selectedFile, {
          headers: {
            "Content-Type": selectedFile.type,
          },
        });
        console.log("up!!", response2);
        setMessage(`✅ קובץ הועלה בהצלחה! ID: ${fileId}`);

      } catch (error: unknown) {
        console.error("שגיאה בהעלאת הקובץ:", error);
        setMessage("❌ שגיאה בהעלאה, נסה שוב.");
        if (axios.isAxiosError(error)) {
          console.log("AxiosError Response: ", error.response);
          console.log("AxiosError Request: ", error.request);
          console.log("AxiosError Message: ", error.message);
        } else {
          console.log("שגיאה כלשהי: ", error);
        }

      }
      finally {
        setUploading(false); // עצירת אנימציה

      }
    }
  }

  const handleSummarizeClick = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("try!");
      console.log(fileUrl);

      const response = await axios.post('https://localhost:7136/api/files/summarize', JSON.stringify(fileUrl), // שליחת המחרוזת בפורמט JSON
        {
          headers: {
            'Content-Type': 'application/json' // הגדרת הכותרת כך שהשרת ידע שמדובר ב-JSON
          }
        }
      );
      setSummary(response.data.summary); // שמירת הסיכום שהתקבל
    } catch (err) {
      setError('שגיאה בהבאת הסיכום. אנא נסה שוב.');
      console.error('Error summarizing file:', err);
    } finally {
      setLoading(false);
    }


  };
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div id="upButtons">
        <IconButton color="primary" onClick={handleButtonClick} sx={{
          width: 56,
          height: 56,
          border: "1px solid black",
          backgroundColor: 'white',
          '&:hover': { backgroundColor: 'ButtonFace' },
          transition: '0.3s',
        }}>
          <AddIcon />
        </IconButton>
        <Button id="summaryButton" variant="outlined" onClick={handleSummarizeClick}>Summary Up!</Button>
      </div>

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
    

  );
}
export default FileUploadButton;

