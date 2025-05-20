import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete, TextField, CircularProgress, Avatar, Chip } from "@mui/material";
import axios from "axios";

export interface User {
    id: number;
    name: string;
}

interface UserPermissionDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (selectedUsers: User[]) => void;
}

const UserPermissionDialog: React.FC<UserPermissionDialogProps> = ({ open, onClose, onSave }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const token = sessionStorage.getItem("token");

    const stringToColor = (string: string) => {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = "#";
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += ("00" + value.toString(16)).substr(-2);
        }
        return color;
    };

    const decodeJwt = (token: any) => {
        if (!token) return null;

        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Invalid JWT token');
            return null;
        }

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

    const getUserCompany = () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.log("No token found in session storage");
            return null;
        }

        const decodedToken = decodeJwt(token);

        if (decodedToken) {
            return decodedToken.company;
        } else {
            console.log("Failed to decode token");
            return null;
        }
    };

    const company = getUserCompany();
    useEffect(() => {
        if (company) {
            console.log("User's company is:", company);
         }

        axios.get("https://localhost:7136/api/User/ByComp", {
            params: { company: company }
        })
            .then(response => {
                const userList = Array.isArray(response.data) ? response.data.map((user: { username: string, id: number }) => ({
                    id: user.id,
                    name: user.username
                })) : [];
                setUsers(userList);
                setLoading(false);
            })
            .catch(error => {
                console.error("❌ שגיאה בטעינת המשתמשים:", error);
                setError("שגיאה בטעינת המשתמשים");
                setLoading(false);
            });
    }, [company]);

    const handleSave = () => {
        onSave(selectedUsers);
        console.log(selectedUsers);
        
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>בחר משתמשים עם גישה לקובץ</DialogTitle>
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : (
                    <Autocomplete
                        multiple
                        options={users}
                        getOptionLabel={(option) => option.name}
                        value={selectedUsers}
                        renderOption={(props, option) => {
                            const isSelected = selectedUsers.some(user => user.id === option.id);
                            return (
                                <li {...props} style={{ backgroundColor: isSelected ? '#b3e0ff' : 'transparent' }}>
                                    <Avatar sx={{ bgcolor: stringToColor(option.name), marginRight: 1 }}>
                                        {option.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    {option.name}
                                    {isSelected && (
                                        <span style={{ marginLeft: 'auto', color: '#4caf50' }}>✔️</span>
                                    )}
                                </li>
                            );
                        }}
                        renderInput={(params) => <TextField {...params} label="בחר משתמשים" variant="outlined" />}
                        onChange={(_, newValue) => setSelectedUsers(newValue)}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">ביטול</Button>
                <Button onClick={handleSave} color="primary" variant="contained">שמור</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserPermissionDialog;
