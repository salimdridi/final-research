import React from "react";
import Container from "react-bootstrap/Container";
import styled from "styled-components";
import About from "./components/About";
import Feedback from "./components/Feedback";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import SearchCard from "./components/SearchCard";
import Results from "./components/Results";

const Wrapper = styled(Container)`
  margin-top: 70px;
`;

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/about">
          <Wrapper>
            <About />
          </Wrapper>
        </Route>
        <Route exact path="/feedback">
          <Wrapper>
            <Feedback />
          </Wrapper>
        </Route>

        <Route exact path="/">
          <Wrapper>
            <SearchCard />
          </Wrapper>
        </Route>

        <Route exact path="/search">
          <Wrapper>
            <Results />
          </Wrapper>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
