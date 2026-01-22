import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: any) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('shiksha_user');
        if (storedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const storedUsers = JSON.parse(localStorage.getItem('shiksha_users') || '[]');
        const existingUser = storedUsers.find((u: any) => u.email === email && u.password === password);

        if (existingUser) {
            localStorage.setItem('shiksha_user', JSON.stringify(existingUser));
            setIsAuthenticated(true);
            setUser(existingUser);
            return true;
        }
        return false;
    };

    const register = async (userData: any): Promise<boolean> => {
        const storedUsers = JSON.parse(localStorage.getItem('shiksha_users') || '[]');
        const existingUser = storedUsers.find((u: any) => u.email === userData.email);

        if (existingUser) {
            return false; // Already exists
        }

        const newUser = { ...userData, id: Date.now().toString() };
        localStorage.setItem('shiksha_users', JSON.stringify([...storedUsers, newUser]));

        // Auto-login after register
        localStorage.setItem('shiksha_user', JSON.stringify(newUser));
        setIsAuthenticated(true);
        setUser(newUser);
        return true;
    };

    const logout = () => {
        localStorage.removeItem('shiksha_user');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
