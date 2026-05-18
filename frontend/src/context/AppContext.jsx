import React from "react";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

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

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn("Token fetch failed:", error);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, [getToken]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/me");

      if (data?.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities || []);
      } else {
        setIsOwner(false);
        setSearchedCities([]);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      setIsOwner(false);
      setSearchedCities([]);
    } finally {
      setRoleLoaded(true);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchUser();
    }

    if (isLoaded && !user) {
      setIsOwner(false);
      setSearchedCities([]);
      setRoleLoaded(true);
    }
  }, [isLoaded, user]);

  const value = {
    currency,
    navigate,
    axios,
    user,
    getToken,
    isOwner,
    roleLoaded,
    showHotelReg,
    setShowHotelReg,
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