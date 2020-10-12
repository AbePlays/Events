import React from "react";
import "./style.css";

function Auth() {
  return (
    <form className="auth-form">
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" />
      </div>

      <div className="form-actions">
        <button type="submit">Login</button>
        <button type="button">Signup</button>
      </div>
    </form>
  );
}

export default Auth;
