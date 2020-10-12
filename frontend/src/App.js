import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import Auth from "./components/Auth";
import Events from "./components/Events";
import Bookings from "./components/Bookings";

function App() {
  return (
    <BrowserRouter>
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
