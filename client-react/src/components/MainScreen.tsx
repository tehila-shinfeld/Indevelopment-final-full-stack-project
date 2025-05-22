// import FileUploadButton from "./FileUploadButton";
// import "../styleSheets/MainScreen.css";
// import { useState } from "react";

import FileUploadButton from "./FileUploadButton";

const MainScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  return (
    <div id="main">
      {/* <FileUploadButton  onFileUpload={(url) => setUploadedFileUrl(url)} ></FileUploadButton> */}
      {/* <SummarizeFile fileUrl={uploadedFileUrl || ""}/> */}
      <FileUploadButton></FileUploadButton>
    </div>
  );
};

export default MainScreen;