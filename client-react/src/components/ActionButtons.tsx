import { Edit, Save } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

export const ActionButtons = () => {
  return (
    <Box display="flex" justifyContent="center" gap={2} mt={2}>
      <Button variant="contained" startIcon={<Edit />}>ערוך</Button>
      <Button variant="contained" color="primary" startIcon={<Save />}>שמור קובץ</Button>
    </Box>
  );
};
