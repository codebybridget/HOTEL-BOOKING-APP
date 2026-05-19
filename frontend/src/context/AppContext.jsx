import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axiosLib from "axios";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const axios = axiosLib.create({
  baseURL: backendUrl,
  withCredentials: true,
});

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [roleLoaded, setRoleLoaded] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);

  const currency = import.meta.env.VITE_CURRENCY || "₦";

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

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  const fetchUser = async () => {
    try {
      setRoleLoaded(false);

      const { data } = await axios.get("/api/user");

      if (data?.success) {
        const userData = data.user || {};

        setIsOwner(userData.role === "hotelOwner");
        setSearchedCities(userData.recentSearchedCities || []);
      } else {
        setIsOwner(false);
        setSearchedCities([]);
      }
    } catch (error) {
      console.error(
        "Failed to load user:",
        error.response?.data || error.message
      );

      setIsOwner(false);
      setSearchedCities([]);
    } finally {
      setRoleLoaded(true);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      fetchUser();
    } else {
      setIsOwner(false);
      setSearchedCities([]);
      setRoleLoaded(true);
    }
  }, [isLoaded, user]);

  const value = useMemo(
    () => ({
      currency,
      navigate,
      axios,
      user,
      getToken,
      isOwner,
      setIsOwner,
      roleLoaded,
      showHotelReg,
      setShowHotelReg,
      searchedCities,
      setSearchedCities,
      fetchUser,
    }),
    [
      currency,
      navigate,
      user,
      getToken,
      isOwner,
      roleLoaded,
      showHotelReg,
      searchedCities,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
};