import { createContext, useContext, useState, ReactNode } from "react";

// 📌 ממשק המייצג את פרטי המשתמש
interface User {
    username?: string;
    passwordHash?: string; // עדיף לא לשמור סיסמאות בצד לקוח!
    company?: string;
    role?: string;
    email?: string;
}

// 📌 ממשק לניהול ההקשר של המשתמש
interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

// 📌 יצירת הקונטקסט
const UserContext = createContext<UserContextType | undefined>(undefined);

// 📌 ספק הקונטקסט שיאחסן את המשתמש
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // פונקציה להתנתקות (מוחקת את המשתמש מהסטייט)
    const logout = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// 📌 קריאה לשימוש בקונטקסט
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
