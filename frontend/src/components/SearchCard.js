import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const SearchCard = () => {
  return (
    <Card style={{ width: "100%", height: "85px" }}>
      <Card.Body>
        <Form style={{ display: "flex" }} action="/search" method="get">
          <Form.Control
            type="search"
            name="search"
            placeholder="Search Research Papers! (by title)"
          />
          <Button variant="dark" style={{ height: "40px" }} type="submit">
            Search
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SearchCard;
