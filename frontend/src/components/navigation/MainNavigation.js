import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./style.css";

function MainNavigation() {
  const { token, logout } = useContext(AuthContext);

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>Eventbux</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          {!token && (
            <li>
              <NavLink to="/auth">Auth</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {token && (
            <>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li onClick={logout}>Logout</li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
