import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EmailSubscribe from "../components/EmailSubscribe";

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <AppRoutes />
        <EmailSubscribe />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
