import React, { useState } from "react";
import { Box, Button, Drawer, Typography } from "@mui/material";
import MainScreen from "./MainScreen";

const BottomDrawer = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button style={{ width: '100%' }} variant="outlined" onClick={() => setOpen(true)}>
                New Meeting !
            </Button>
            <Box sx={{ position: "fixed", bottom: 20, left: 0, right: 0, textAlign: "center" }}>


                <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
                    <Box sx={{ p: 2, textAlign: "center", width: "100%" }}>
                        <Typography variant="body2">
                            <MainScreen></MainScreen>
                        </Typography>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </Box>
                </Drawer>
            </Box>
        </>

    );
};

export default BottomDrawer;
