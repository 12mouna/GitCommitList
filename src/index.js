import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./services/apollo-client";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./App";
import DetailCommit from "./components/details-commit";

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Route exact path="/" component={App} />

        <Route path="/:commithash" component={DetailCommit} />
      </div>
    </Router>
  </ApolloProvider>,

  document.getElementById("root")
);
