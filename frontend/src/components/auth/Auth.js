import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./style.css";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const { login } = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      return;
    }

    let queryBody = {
      query: `
        query {
          login(email : "${email}", password : "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `,
    };

    if (!isLogin) {
      queryBody = {
        query: `
          mutation {
            createUser(userInput : {
              email : "${email}",
              password : "${password}"
            }) {
              _id
              email
            }
          }
        `,
      };
    }

    fetch("http://localhost:1000/graphql", {
      method: "POST",
      body: JSON.stringify(queryBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((res) => {
        if (res.data.login.token) {
          login(
            res.data.login.token,
            res.data.login.userId,
            res.data.login.tokenExpiration
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {!isLogin && (
        <div className="form-control">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      )}

      <div className="form-actions">
        {isLogin ? (
          <div>
            <button type="submit">Login</button>
            <p>
              Don't have an account?
              <span onClick={() => setIsLogin((prev) => !prev)}> Sign up</span>
            </p>
          </div>
        ) : (
          <div>
            <button type="submit">Sign up</button>
            <p>
              Already have an account?
              <span onClick={() => setIsLogin((prev) => !prev)}> Login</span>
            </p>
          </div>
        )}
      </div>
    </form>
  );
}

export default Auth;
