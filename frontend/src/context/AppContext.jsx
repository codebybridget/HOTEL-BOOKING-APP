import React from "react";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

// 🔥 IMPORTANT: SET BASE URL ONCE
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

axios.defaults.baseURL = API_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [roleLoaded, setRoleLoaded] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);

  const currency = import.meta.env.VITE_CURRENCY || "$";

  // =========================
  // ATTACH CLERK TOKEN
  // =========================
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken({ template: "backend" });

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch {
          console.warn("Token fetch failed");
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, [getToken]);

  // =========================
  // FETCH USER
  // =========================
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user");

      if (data?.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities || []);
        setRoleLoaded(true);
      } else {
        toast.error(data?.message || "Auth failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user");
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchUser();
    }
  }, [isLoaded, user]);

  const value = {
    // Core
    currency,
    navigate,
    axios,

    // Auth
    user,
    getToken,
    isOwner,
    roleLoaded,

    // UI
    showHotelReg,
    setShowHotelReg,

    // Data
    searchedCities,
    setSearchedCities,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
};