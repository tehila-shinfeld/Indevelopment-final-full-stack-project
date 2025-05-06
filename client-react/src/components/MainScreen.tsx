import { Card, CardContent, Typography } from "@mui/material";
import FileUploadButton from "./FileUploadButton";
import SummarizeFile from "./SummarizeFile";
// import "../styleSheets/MainScreen.css";
import { useState } from "react";

const MainScreen = () => {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  return (
    <div id="main">
      <FileUploadButton  onFileUpload={(url) => setUploadedFileUrl(url)} ></FileUploadButton>
      {/* <SummarizeFile fileUrl={uploadedFileUrl || ""}/> */}
    </div>
  );
};

export default MainScreen;