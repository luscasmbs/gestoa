
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  updateProfile: (name: string, avatarUrl: string) => void;
  updatePassword: (newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('project-gestao-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, password?: string) => {
    const foundUser = USERS.find(u => u.name.toLowerCase() === username.toLowerCase());
    if (foundUser && (!foundUser.password || foundUser.password === password)) {
      localStorage.setItem('project-gestao-user', JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('project-gestao-user');
    setUser(null);
  };

  const updateProfile = (name: string, avatarUrl: string) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const updatedUser = { ...currentUser, name, avatarUrl };
        localStorage.setItem('project-gestao-user', JSON.stringify(updatedUser));
        return updatedUser;
    });
  };

  const updatePassword = (newPassword: string) => {
      setUser(currentUser => {
        if (!currentUser) return null;
        const updatedUser = { ...currentUser, password: newPassword };
        localStorage.setItem('project-gestao-user', JSON.stringify(updatedUser));
        // In a real app, you would also update the USERS constant or database
        const userInDb = USERS.find(u => u.id === currentUser.id);
        if(userInDb) userInDb.password = newPassword;
        return updatedUser;
    });
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
