import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import Auth from "./components/auth/Auth";
import Events from "./components/events/Events";
import Bookings from "./components/bookings/Bookings";
import MainNavigation from "./components/navigation/MainNavigation";

function App() {
  return (
    <BrowserRouter>
      <MainNavigation />
      <Switch>
        <Redirect from="/" to="/auth" exact />
        <Route path="/auth" component={Auth} />
        <Route path="/events" component={Events} />
        <Route path="/bookings" component={Bookings} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
