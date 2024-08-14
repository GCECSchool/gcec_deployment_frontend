import React, { useState } from "react";
import "../Login/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (!userId || !password) {
        setError("Please fill in both the user ID and password fields.");
        return;
      }
      setLoading(true); // Start loading
      const response = await axios.post(
        "https://gcecbackend-195.onrender.com/api/v1/user/login",
        {
          userId,
          password,
        }
      );

      if (response.status === 200) {
        // Login successful
        localStorage.setItem("token", response.data.token); // Store token in local storage
        const userData = response.data.user;
        if (userData.status === "Office") {
          // Redirect to office dashboard or specific route for office users
          navigate("/dashboard");
        } else {
          // Show error message and prevent navigation
          setError("You are not authorized to access this dashboard.");
          // Optionally clear localStorage or perform other actions as needed
          localStorage.removeItem("token");
        }
      } else {
        if (response.data.message === "UserId is not registered") {
          setError("Invalid user. Please check your user ID.");
        } else {
          setError(response.data.message);
        }
      }
    } catch (error) {
      setError("Invalid User! Please try again later.");
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginGlass">
        <h1>Login</h1>

        {loading ? (
          <div className="loadingContainer">
            <CircularProgress />
            <p className="loadingTeacher">Logging in please wait...</p>
          </div>
        ) : (
          <div className="loginForm">
            <div className="input-group flex-nowrap">
              <span
                className="input-group-text"
                id="addon-wrapping"
                style={{ width: "100px" }}
              >
                User-Id
              </span>
              <input
                style={{ width: "100px" }}
                type="text"
                className="form-control"
                placeholder="User-Id"
                aria-label="User-Id"
                aria-describedby="addon-wrapping"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div className="input-group flex-nowrap">
              <span
                className="input-group-text"
                id="addon-wrapping"
                style={{ width: "100px" }}
              >
                Password
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Password"
                aria-label="Password"
                aria-describedby="addon-wrapping"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}{" "}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
