import React from "react";
import { Router, Route, IndexRoute } from "react-router";
import { history } from "./store.js";
import Application from "./components/Application";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import UserEdit from "./components/UserEdit";
import NotFound from "./components/NotFound";

// build the router
const router = (
  <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
    <Route path="/" component={Application}>
      <IndexRoute component={Home}/>
      <Route path="dashboard" component={Dashboard} />
      <Route path="user-edit(/:id)" component={UserEdit}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
);

// export
export { router };
