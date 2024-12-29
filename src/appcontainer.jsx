import React from "react";
// import config from "config";

import { Route, BrowserRouter as Router } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/header";
import Home from "./components/home";

const AppContainer = function () {
  return (
    // <Router basename={`${config.publicPath}`}>
    <Router basename="/">
      <>
        <Route render={(props) => <Header {...props} />} />
        
          {/* home */}
          <Route exact path="/home" component={Home} />
        

        <Route render={(props) => <Footer {...props} />} />
      </>
    </Router>
  );
};

export default AppContainer;
