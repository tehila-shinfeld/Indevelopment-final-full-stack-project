import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useRef, useState } from "react";
import axios from "axios"; // ייבוא axios לשליחת בקשות API

const FileUploadButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];

      console.log(`📂 קובץ שנבחר: ${selectedFile.name}, גודל: ${selectedFile.size} בייטים, סוג: ${selectedFile.type}`);
      setFile(selectedFile); // מעדכנים את state עם הקובץ שנבחר

      // 2️⃣ שליחת בקשה לשרת לקבלת Presigned URL
      try {
        console.log("שליחת שם הקובץ לשרת לקבלת Presigned URL");
      
        // שליחת שם הקובץ לשרת לקבלת Presigned URL
        const response = await axios.post("https://localhost:7136/api/files/upload", {
          fileName: selectedFile.name,
        });
        console.log(" res", response);
      
        const { fileId, fileUrl } = response.data;
      
        // 3️⃣ העלאה ישירה ל-S3 בעזרת ה-Presigned URL
        setUploading(true);
        await axios.put(fileUrl, selectedFile, {
          headers: {
            "Content-Type": selectedFile.type,
          },
        });
        console.log("up!!");
      
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
      <IconButton color="primary" onClick={handleButtonClick}>
        <AddIcon />
      </IconButton>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUploadButton;
