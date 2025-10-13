import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

// ✅ Set backend base URL from environment
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);

  /**
   * ✅ Automatically attach Clerk backend token to all axios requests
   */
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        try {
          // 🔑 Use the JWT template name EXACTLY as in Clerk dashboard ("backend")
          const token = await getToken({ template: "backend" });

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            console.warn("⚠️ No token returned from Clerk — check JWT template name.");
          }
        } catch (error) {
          console.error("❌ Failed to get Clerk token:", error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [getToken]);

  /**
   * ✅ Fetch user details from backend
   */
  const fetchUser = async () => {
    try {
      const token = await getToken({ template: "backend" });

      if (!token) {
        console.warn("⚠️ Missing token — cannot fetch user.");
        return;
      }

      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchedCities || []);
      } else {
        console.warn("⚠️ Backend responded without success:", data);
      }
    } catch (error) {
      console.error("❌ Error fetching user from backend:", error);
      toast.error("Failed to load user information.");
    }
  };

  /**
   * ✅ Re-fetch user data when Clerk user changes
   */
  useEffect(() => {
    if (isLoaded && user) {
      console.log("👤 Clerk user detected:", user.id);
      fetchUser();
    } else if (isLoaded && !user) {
      console.warn("⚠️ No Clerk user logged in.");
    }
  }, [user, isLoaded]);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
