import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import MainNavigation from "./components/navigation/MainNavigation";
import AuthContextProvider from "./context/AuthContext";
import Router from "./Router";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <MainNavigation />
        <Router />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
