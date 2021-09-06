import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

const About = () => {
  return (
    <>
      <Tabs defaultActiveKey="facts">
        <Tab eventKey="facts" title="Facts">
          <ol>
            <li>A</li>
            <li>B</li>
            <li>C</li>
            <li>D</li>
            <li>E</li>
          </ol>
        </Tab>
        <Tab eventKey="privacy" title="Privacy">
          <ol>
            <li>A</li>
            <li>B</li>
            <li>C</li>
            <li>D</li>
            <li>E</li>
          </ol>
        </Tab>
        <Tab eventKey="takeown" title="Takedown">
          <ol>
            <li>A</li>
            <li>B</li>
            <li>C</li>
            <li>D</li>
            <li>E</li>
          </ol>
        </Tab>
      </Tabs>
    </>
  );
};

export default About;
