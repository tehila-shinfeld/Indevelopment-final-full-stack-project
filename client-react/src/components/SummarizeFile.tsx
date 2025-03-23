import { useState } from 'react';
import { Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import "../styleSheets/FileUploadButton.css"

const SummarizeFile: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
    const [summary, setSummary] = useState<string | null>("תאור הפרויקט והתהליכים! מסך 1 התחברות \\ הרשמה המשתמש מתחבר או נרשם למערכת מקבל טוקן מסך 2 ממשק להעלאת קובץ, כפתור 'סיכום', קובץ נשמר בענן מתבצעת קריאה ל API שמחזיר את הסיכום של הקובץ הסיכום מוצג למשתמש על המסך ויש כפתור לשמירה בעת לחיצה על כפתור השמירה הקובץ נשמר בענן חוזר ה URL שלו ונשמר בדאטה בייס ברשומה של האובייקט הנוכחי – של הישיבה הנוכחית.....");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);



    // שמירת הסיכום ב-DB
    const handleSaveSummary = async () => {
        if (!summary) {
            alert("error")
            return;
        }
        try {
            const summaryy = {
                FileUrl: fileUrl, // מזהה הקובץ (אם קיים)
                summary: summary, // הסיכום עצמו
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
        <>
            <CardContent>
                {/* כותרת */}
                <Typography variant="h5" component="div" className="upload-title">
                    Upload a file!
                </Typography>
                <Typography color="text.secondary" variant="body2">{summary}</Typography>

                {error && <Typography color="error">{error}</Typography>}
            </CardContent>
            <div id="buttons">
                <Button  variant="outlined" onClick={handleSaveSummary}>Save Summary</Button>
                <Button variant="outlined" >Edit</Button>
            </div>
        </>

    );
};

export default SummarizeFile;
