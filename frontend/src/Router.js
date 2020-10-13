import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Auth from "./components/auth/Auth";
import Events from "./components/events/Events";
import Bookings from "./components/bookings/Bookings";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { token } = useContext(AuthContext);

  return (
    <Switch>
      {token && <Redirect from="/" to="/events" exact />}
      {token && <Redirect from="/auth" to="/events" />}
      {!token && <Route path="/auth" component={Auth} />}
      <Route path="/events" component={Events} />
      {token && <Route path="/bookings" component={Bookings} />}
      {!token && <Redirect to="/auth" />}
    </Switch>
  );
}

export default App;
