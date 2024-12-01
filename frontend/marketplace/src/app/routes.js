import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/pages/home";
import BusinessListings from "../components/pages/business_listings";
import Login from "../components/pages/login";
import PageNotFound from "../components/pages/page_not_found";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/business-listings" element={<BusinessListings />} />
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default AppRoutes;
