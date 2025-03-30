import { useEffect, useState } from 'react';
import { Button, Card,  Typography } from '@mui/material';
import axios from 'axios';
import "../styleSheets/FileUploadButton.css"
import "../styleSheets/SummarizeFile.css"
import { useSummary } from './context/SummaryContext';
import UserPermissionDialog, { User } from './UserPermissionDialog';

const SummarizeFile: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
    const { summary } = useSummary();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const handleOpenPermissionDialog = () => setOpenPermissionDialog(true);
    const handleClosePermissionDialog = () => setOpenPermissionDialog(false);

    useEffect(() => {
        console.log("📂 URL חדש התקבל:", fileUrl);
    }, [fileUrl]); 
    const handleSavePermissionsAndSummary = async (users: User[]) => {
        setSelectedUsers(users);
        console.log(users.map(user => user.id));
        // 1️⃣ שמירת ההרשאות
        try {
            alert({ fileUrl } + "saneach!")
            await axios.post("https://localhost:7136/api/files/assign-file-to-customers", {
                FileUrl: fileUrl,
                UserserIds: users.map(user => user.id)
            });
            alert("הרשאות נשמרו בהצלחה!")
            console.log("הרשאות נשמרו בהצלחה!");
            handleSaveSummary();
        } catch (err) {
            setError("שגיאה בשמירת ההרשאות");
            return;
        }
    };

    // שמירת הסיכום ב-DB
    const handleSaveSummary = async () => {
        if (!summary) {
            alert("error")
            return;
        }
        try {
            console.log(fileUrl);
            const summaryy = {
                FileUrl: fileUrl,
                summary: summary,
            };
            console.log("שולח נתונים:", summaryy);
            const response = await axios.post('https://localhost:7136/api/files/save-summary', summaryy,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data.success) {
                console.log("הסיכום נשמר בהצלחה!");
                // setMessage("הסיכום נשמר בהצלחה!");
            } else {
                console.error("שגיאה בשמירת הסיכום");
                setError("שגיאה בשמירת הסיכום");
            }
        } catch (err) {
            // console.error('שגיאה בשמירת הסיכום:', err.response?.data || err.message);
            setError("שגיאה לא צפויה. אנא נסה שוב.");
        }
    };

    return (
        <div className="allContent">
            <Card className="uploadCard">
                <div className="all">
                    <Typography variant="h5" component="div" >
                        The summary is ready :
                    </Typography>
                    <Typography className='summaryContain' color="text.secondary" variant="body2">{summary}</Typography>
                    {error && <Typography color="error">{error}</Typography>}
                </div>
            </Card>
            <div id="buttons">
                <Button variant="outlined" onClick={handleOpenPermissionDialog}>Save Summary</Button>
                <Button variant="outlined" >Edit</Button>
            </div>
            <UserPermissionDialog
                open={openPermissionDialog}
                onClose={handleClosePermissionDialog}
                onSave={handleSavePermissionsAndSummary}
            />
        </div>
    );

};


export default SummarizeFile;