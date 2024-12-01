  import React, { Suspense, lazy } from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "../components/pages/home/page";
import BusinessListings from "../components/pages/business_listings/page";
import Login from "../components/pages/login/page";
import PageNotFound from "../components/pages/page_not_found/page";

const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/business-listings" element={<BusinessListings />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
