"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchAPI } from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  
  const [state, setState] = useState({ user: null, isReady: false });

  
  useEffect(() => {

    const timer = setTimeout(() => {
      let user = null;
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (token && savedUser) {
        try {
          user = JSON.parse(savedUser);
        } catch {}
      }
      setState({ user, isReady: true });
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    const res = await fetchAPI("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login gagal");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setState((prev) => ({ ...prev, user: data.user }));
    return data;
  };

  const register = async (name, email, password, password_confirmation) => {
    const res = await fetchAPI("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registrasi gagal");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setState((prev) => ({ ...prev, user: data.user }));
    return data;
  };

  const logout = async () => {
    try {
      await fetchAPI("/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setState((prev) => ({ ...prev, user: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isReady: state.isReady,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
