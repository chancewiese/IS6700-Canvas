import { createContext, useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const usersApi = useApi("users");

   useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
         setUser(JSON.parse(storedUser));
      }
      setLoading(false);
   }, []);

   const login = async (email, password) => {
      try {
         const users = await usersApi.getAll();
         const user = users.find(
            (u) => u.email === email && u.password === password
         );
         if (user) {
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            return true;
         }
         return false;
      } catch (error) {
         console.error("Login error:", error);
         return false;
      }
   };

   const logout = () => {
      setUser(null);
      localStorage.removeItem("user");
   };

   const register = async (email, password, firstname, lastname, birthdate) => {
      try {
         const users = await usersApi.getAll();
         const existingUser = users.find((u) => u.email === email);
         if (existingUser) {
            return false; // User already exists
         }
         const newUser = await usersApi.create({
            email,
            password,
            firstname,
            lastname,
            birthdate,
            userType: "Student", // Default to Student
         });
         setUser(newUser);
         localStorage.setItem("user", JSON.stringify(newUser));
         return true;
      } catch (error) {
         console.error("Registration error:", error);
         return false;
      }
   };

   return (
      <AuthContext.Provider value={{ user, loading, login, logout, register }}>
         {children}
      </AuthContext.Provider>
   );
};
