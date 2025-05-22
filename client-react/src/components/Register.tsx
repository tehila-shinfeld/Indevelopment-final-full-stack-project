// import { useState } from "react";
// import { TextField, Button, Card, Typography } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const StyledCard = styled(Card)({
//   padding: "20px",
//   backgroundColor: "rgba(255, 255, 255, 0.9)", // שקיפות נמוכה
//   border: "1px solid black",
// });

// interface RegisterFormProps {
//   closeModal: () => void;
// }

// function Register({ closeModal }: RegisterFormProps) {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     email: "",
//     company: "",
//     role: "",
//   });
//   const navigate = useNavigate();

//   const [error, setError] = useState("");
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleChange = (e: any) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async () => {
//     try {
//       const response = await axios.post(`https://localhost:7136/api/Auth/register`,
//         {
//           Username: formData.username,
//           PasswordHash: formData.password,
//           Company: formData.company,
//           Email: formData.email,
//           Role: formData.role
//         });
//       sessionStorage.setItem("token", response.data.token);
//       console.log("token", response.data.token);

//       alert("sucsess!!!🤗");
//       closeModal(); // סגירת הפופ-אפ לאחר הרשמה מוצלחת
//       navigate('/myMeetings'); // מעבר לדף Dashboard

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (err) {
//       setError("היתה שגיאה בהרשמה");
//     }
//   };

//   return (
//     <StyledCard>
//       <Typography variant="h6">הרשמה</Typography>
//       {error && <Typography color="error">{error}</Typography>}
//       <TextField label="שם משתמש" name="username" fullWidth margin="normal" onChange={handleChange} />
//       <TextField label="סיסמה" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
//       <TextField label="מייל" name="email" type="email" fullWidth margin="normal" onChange={handleChange} />
//       <TextField label="חברה" name="company" fullWidth margin="normal" onChange={handleChange} />
//       <TextField label="תפקיד" name="role" fullWidth margin="normal" onChange={handleChange} />
//       <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
//         הירשם
//       </Button>
//     </StyledCard>
//   );
// }

// export default Register;
