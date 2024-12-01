import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BusinessListings from '../components/pages/business_listings/page';
// Import other components/pages as needed

function AppRoutes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/business_listings" component={BusinessListings} />
        {/* Add more routes as needed */}
        <Route path="*" component={NotFoundPage} /> {/* Optional: 404 page */}
      </Switch>
    </Router>
  );
}

export default AppRoutes;
