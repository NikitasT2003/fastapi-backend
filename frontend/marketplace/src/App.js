import React, { useState } from "react";
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

const App = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    is_seller: false,
  });

  const [business, setBusiness] = useState({
    name: "",
    description: "",
    location: "",
    owner_id: "",
    founded: "",
    industry: "",
    email: "",
  });

  const handleUserChange = (event) => {
    const { name, value, type, checked } = event.target;
    setUser({ ...user, [name]: type === "checkbox" ? checked : value });
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/user/", user);
      setUser({
        username: "",
        email: "",
        password: "",
        is_seller: false,
      });
      alert("User created successfully!");
    } catch (error) {
      alert(`Error creating user: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleBusinessChange = (event) => {
    const { name, value, type, checked } = event.target;
    setBusiness({ ...business, [name]: type === "checkbox" ? checked : value });
  };

  const handleBusinessSubmit = async (event) => {
    event.preventDefault();
    try {
      const businessData = {
        ...business,
        owner_id: business.owner_id ? parseInt(business.owner_id) : null,
        founded: business.founded ? parseInt(business.founded) : null
      };
      
      await api.post("/business", businessData);
      setBusiness({
        name: "",
        description: "",
        location: "",
        owner_id: "",
        founded: "",
        industry: "",
        email: "",
      });
      alert("Business created successfully!");
    } catch (error) {
      alert(`Error creating business: ${error.response?.data?.detail || error.message}`);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Marketplace App</a>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <h2>Create User</h2>
            <form onSubmit={handleUserSubmit}>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={user.username}
                  onChange={handleUserChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={user.email}
                  onChange={handleUserChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={user.password}
                  onChange={handleUserChange}
                  required
                />
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="is_seller"
                  checked={user.is_seller}
                  onChange={handleUserChange}
                />
                <label className="form-check-label">Is Seller</label>
              </div>
              <button type="submit" className="btn btn-primary mt-3">Create User</button>
            </form>
          </div>

          <div className="col-md-6">
            <h2>Create Business</h2>
            <form onSubmit={handleBusinessSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={business.name}
                  onChange={handleBusinessChange}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={business.description}
                  onChange={handleBusinessChange}
                />
              </div>
              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={business.location}
                  onChange={handleBusinessChange}
                />
              </div>
              <div className="form-group">
                <label>Industry:</label>
                <input
                  type="text"
                  className="form-control"
                  name="industry"
                  value={business.industry}
                  onChange={handleBusinessChange}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={business.email}
                  onChange={handleBusinessChange}
                />
              </div>
              <div className="form-group">
                <label>Founded Year:</label>
                <input
                  type="number"
                  className="form-control"
                  name="founded"
                  value={business.founded}
                  onChange={handleBusinessChange}
                />
              </div>
              <div className="form-group">
                <label>Owner ID:</label>
                <input
                  type="number"
                  className="form-control"
                  name="owner_id"
                  value={business.owner_id}
                  onChange={handleBusinessChange}
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">Create Business</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
