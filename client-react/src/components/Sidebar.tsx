import { Summarize, UploadFile } from "@mui/icons-material";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import React, { useState } from "react";

export const Sidebar = () => {
    // Define the state to track whether the drawer is open or closed
    const [open, setOpen] = useState(false);

    // Define the toggleSidebar function to toggle the open/close state
    const toggleSidebar = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    return (
        <>
            {/* כפתור לפתיחת ה-Sidebar */}
            <IconButton onClick={toggleSidebar}>
                <UploadFile /> {/* Icon button can be anything, here UploadFile icon is used */}
            </IconButton>

            {/* הפופאפ הצדדי */}
            <Drawer anchor="left" open={open} onClose={toggleSidebar}>
                <List>
                    <ListItem onClick={toggleSidebar}>
                        <ListItemIcon><UploadFile /></ListItemIcon>
                        <ListItemText primary="העלאת קובץ" />
                    </ListItem>
                    <ListItem onClick={toggleSidebar}>
                        <ListItemIcon><Summarize /></ListItemIcon>
                        <ListItemText primary="סיכום קובץ" />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};
