import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { loginUser, registerUser } from "./signup_login";
import Home from "./pages/Home";
import ListBusinesses from "./pages/ListBusinesses";

const App = () => {
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    is_seller: false,
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleRegisterChange = (event) => {
    const { name, value, type, checked } = event.target;
    setRegisterData({ ...registerData, [name]: type === "checkbox" ? checked : value });
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    try {
      await registerUser(registerData);
      alert("Registration successful!");
      setRegisterData({
        username: "",
        email: "",
        password: "",
        is_seller: false,
      });
    } catch (error) {
      alert(`Registration error: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginUser(loginData);
      alert("Login successful!");
      console.log("User token:", response.token);
      setLoginData({
        username: "",
        password: "",
      });
    } catch (error) {
      alert(`Login error: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <Link className="navbar-brand" to="/">Marketplace</Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/">Home</Link>
              <Link className="nav-link" to="/businesses">Businesses</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/businesses" element={<ListBusinesses />} />
        </Routes>

        <div className="container mt-4">
          <h2>Register</h2>
          <form onSubmit={handleRegisterSubmit}>
            <input
              type="text"
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              placeholder="Username"
              required
            />
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              placeholder="Password"
              required
            />
            <label>
              <input
                type="checkbox"
                name="is_seller"
                checked={registerData.is_seller}
                onChange={handleRegisterChange}
              />
              Is Seller
            </label>
            <button type="submit">Register</button>
          </form>

          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleLoginChange}
              placeholder="Username"
              required
            />
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              placeholder="Password"
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </Router>
  );
};

export default App;
