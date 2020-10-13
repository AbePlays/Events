import React, { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthContextProvider(props) {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };
  const logout = () => {};
  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
