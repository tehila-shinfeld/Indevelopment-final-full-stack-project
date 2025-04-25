import { Button, Card, CircularProgress, IconButton, LinearProgress, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styleSheets/FileUploadButton.css";
import { useSummary } from "../context/SummaryContext";
import * as pdfjsLib from "pdfjs-dist";
import * as mammoth from "mammoth";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url';
GlobalWorkerOptions.workerSrc = workerSrc;

const FileUploadButton: React.FC<{ onFileUpload: (url: string) => void }> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [s3url, sets3url] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const { setSummary } = useSummary();
  const [fileTextContent, setFileTextContent] = useState<string | null>(null);


  useEffect(() => {
    if (s3url) {
      console.log("📡 מעדכנת את הקובץ בקומפוננטה הראשית:", s3url);
      onFileUpload(s3url);
    }
    console.log("📄 תוכן הקובץ:", fileTextContent ? fileTextContent.substring(0, 300) : "No content available"); // תצוגה חלקית

  }, [s3url, fileTextContent]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    if (event.target.files && event.target.files.length > 0) {
      handleFileUpload(event.target.files[0]);
    }
  };

  // הפונקציה שמבצעת את הכניסה למצב של גרירה
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  // הפונקציה שמבצעת את היציאה מהמצב של גרירה
  const handleDragLeave = () => {
    setDragging(false);
  };

  // הפונקציה שמבצעת את הכניסה למצב של גרירה
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length > 0) {
      handleFileUpload(event.dataTransfer.files[0]);
    }
  };

  // הפונקציה שמבצעת את הסיכום
  const handleSummarize = async () => {

    if (!fileUrl) {
      alert("No file URL provided!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('https://localhost:7136/api/files/summarize', {
        text: fileTextContent
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('שגיאה בשליחת הבקשה:', error);
      alert('אירעה שגיאה בשליחת הבקשה');
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (selectedFile: File) => {
    setUploading(true);
    setFile(selectedFile);

    try {
      let textContent = "";

      if (selectedFile.type === "text/plain") {

        // TXT
        const reader = new FileReader();
        textContent = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(selectedFile);
        });

      }
      else if (selectedFile.type === "application/pdf") {
        // PDF
        const pdfData = await selectedFile.arrayBuffer();
        const pdf = await getDocument({ data: pdfData }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          textContent += strings.join(' ') + '\n';
        }
      } else if (
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // DOCX
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        textContent = result.value;

      } else {
        throw new Error("Unsupported file type");
      }

      setFileTextContent(textContent); // שומר את התוכן
      console.log("📄 תוכן הקובץ:", textContent.substring(0, 300)); // תצוגה חלקית

      // ⬇️ המשך התהליך הרגיל של ההעלאה לשרת
      const response1 = await axios.post("https://localhost:7136/api/files/upload", {
        fileName: selectedFile.name,
      });

      const { fileId, fileUrl, s3Url } = response1.data;
      setFileUrl(fileUrl);
      sets3url(s3Url);
      onFileUpload(s3Url);

      await axios.put(fileUrl, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      setMessage(`✅ הקובץ הועלה בהצלחה! ID: ${fileId}`);
    } catch (error) {
      console.error("❌ שגיאה:", error);
      setMessage("❌ שגיאה בהעלאה או בקריאה, נסי שוב.");
    } finally {
      setUploading(false);
    }
  };
  // // הפונקציה שמבצעת את ההעלאה של הקובץ לשרת
  // const handleFileUpload = async (selectedFile: File) => {
  //   setUploading(true);
  //   setFile(selectedFile);
  //   console.log(selectedFile , "selectedFile");

  //   try {
  //     console.log("📡 שולחת בקשה לשרת לקבלת URL...");
  //     const response1 = await axios.post("https://localhost:7136/api/files/upload", {
  //       fileName: selectedFile.name,
  //     });
  //     const { fileId, fileUrl, s3Url } = response1.data; // שים לב לשינוי השם ל-s3Url
  //     setFileUrl(fileUrl);
  //     sets3url(s3Url); // עדכון הסטייט עם הערך הנכון

  //     console.log("✅ S3eUrl עודכן ל:", s3Url);

  //     onFileUpload(s3Url);

  //     await axios.put(fileUrl, selectedFile, {
  //       headers: {
  //         "Content-Type": selectedFile.type,
  //       },
  //     });

  //     setMessage(`✅ הקובץ הועלה בהצלחה! ID: ${fileId}`);
  //   } catch (error) {
  //     console.error("❌ שגיאה בהעלאת הקובץ:", error);
  //     setMessage("❌ שגיאה בהעלאה, נסה שוב.");
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  return (
    <div className="container">
      <div className="allContent">
        {loading ? (
          <div className="loading-container">
            <CircularProgress style={{ height: '80px', width: '80px', color: 'rgb(91, 140, 155)', marginTop: '100px', zIndex: 1000, position: "absolute" }} />
          </div>
        ) :
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
              </div>
            </div>
          </Card>
        }

      </div>
      <Button
        id="summaryButton"
        variant="contained"
        color="primary"
        onClick={handleSummarize}
      >
        Summary Up!
      </Button>
    </div >
  );

};
export default FileUploadButton;
