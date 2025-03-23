import { Card, CardContent, Typography } from "@mui/material";
import FileUploadButton from "./FileUploadButton";
import SummarizeFile from "./SummarizeFile";
import "../styleSheets/MainScreen.css"; 

const MainScreen = () => {
  return (
    <div id="content">
      <div id="main">
        <FileUploadButton></FileUploadButton>
{/* =================== סיום כרטיס 1 ============================ */}
        {/* כרטיס סיכום */}
        <Card className="upload-card">
          {/* <SummarizeFile fileUrl={"s3Url"} /> */}
        </Card>
      </div>
    </div>
  );
};

export default MainScreen;
