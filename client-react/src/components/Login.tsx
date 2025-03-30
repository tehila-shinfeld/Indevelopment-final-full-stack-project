import { useState } from "react";
import { TextField, Button, Card, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)({
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // שקיפות נמוכה
    border: "1px solid black",
});
interface LoginFormProps {
    closeModal: () => void;
}

function Login({ closeModal }: LoginFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`https://localhost:7136/api/Auth/login`, {
                Username: username,
                Password: password
            });
    
            const token = response.data.token?.result; // בדיקה שהטוקן קיים
            if (!token) {
                throw new Error("Token not received");
            }
    
            sessionStorage.setItem("token", token);
    
            alert("Welcome 🤗");
            closeModal(); // סגירת הפופ-אפ לאחר התחברות מוצלחת
            
            // בדיקה נוספת שהטוקן אכן נשמר לפני הניווט
            if (sessionStorage.getItem("token")) {
                navigate('/myMeetings');
            } else {
                throw new Error("Failed to save token");
            }
    
        } catch (err) {
            console.error(err);
            alert("Error during login 😥");
        }
    };
    

    return (
        <StyledCard>
            <Typography variant="h6">התחברות</Typography>
            <TextField label="שם משתמש" fullWidth margin="normal" onChange={(e) => setUsername(e.target.value)} />
            <TextField label="סיסמה" type="password" fullWidth margin="normal" onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                התחבר
            </Button>
        </StyledCard>
    );
}

export default Login;
