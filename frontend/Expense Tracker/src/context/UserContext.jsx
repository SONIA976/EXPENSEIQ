import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { API_PATHS } from "../Utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Function to update user data
  const updateUser = (userData) => {
    console.log('UserContext: updateUser called with:', userData);
    console.log('UserContext: Previous user state was:', user);
    setUser(userData);
    console.log('UserContext: setUser called, new state should be:', userData);
  };

  // Debug: Log whenever user state changes
  console.log('UserContext: Current user state:', user);
  if (user && user.profilePhoto) {
    console.log('UserContext: Profile photo URL:', user.profilePhoto);
  }

  // Bootstrap user from token on first load
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsInitializing(false);
          return;
        }

        const resp = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        const fetchedUser = resp?.data?.data?.user;
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          // Invalid response shape; clear token defensively
          localStorage.removeItem("token");
        }
      } catch (err) {
        // Token likely invalid/expired
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    bootstrap();
  }, []);

  // Function to clear user data (e.g., on logout)
  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isInitializing,
        updateUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
