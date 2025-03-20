// import FileUploadButton from "./FileUploadButton";

// const Dashboard = () => {
//     return (
//         <>
//             {/* <h1>העלאת קובץ</h1> */}
//             <FileUploadButton   />

//         </>
//     )
// }

// export default Dashboard
import React from "react";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import FileUploadButton from "./FileUploadButton";
import { Sidebar } from "./Sidebar";
import { SummaryDisplay } from "./SummaryDisplay";
import { ActionButtons } from "./ActionButtons";


const MainScreen = () => {
    return (
        <Box sx={{ display: "flex", bgcolor: "#F4F4EB", height: "100vh" }}>
          <Sidebar />
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
            <Box sx={{ display: "flex", gap: 3 }}>
              <FileUploadButton />
              <SummaryDisplay />
            </Box>
            <ActionButtons />
          </Box>
        </Box>
      );
};

export default MainScreen;
