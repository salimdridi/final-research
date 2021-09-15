import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import Alert from "react-bootstrap/Alert";

const myDomain = "Re-SearchEngine.com";
const myLocalDomain = "https://final-research.herokuapp.com";

const Results = () => {
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const params = useLocation().search;

  useEffect(() => {
    const searchParams = new URLSearchParams(params);
    fetch(
      `${myLocalDomain}/search?` + searchParams.toString() + `&page=${page}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) {
          setMessage(res.message);
        } else {
          setResults(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, [page]);

  return (
    <>
      <Form
        style={{ display: "flex", marginBottom: "10px" }}
        action="/search"
        method="get"
      >
        <Form.Control
          type="search"
          name="search"
          placeholder="Search Research Papers and/or Books! (by title or ISBN)"
        />
        <Button variant="dark" style={{ height: "40px" }} type="submit">
          Search
        </Button>
      </Form>
      {message && <Alert variant="primary">{message}</Alert>}
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Title and ISBN</th>
            <th>Author(s)</th>
            <th>Journal</th>
            <th>Year</th>
            <th>Pages</th>
            <th>Size</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {results.map(({ docs, position }, i) => (
            <tr>
              <td>{position + 1}</td>
              <td>
                <a href={docs.Link}>{docs.Name}</a>
              </td>
              <td>{docs.Author}</td>
              <td>{docs.Journal}</td>
              <td>{docs.Year}</td>
              <td>{docs.Pages}</td>
              <td>{docs.Size}</td>
              <td>{docs.Type}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.Prev
          onClick={() => setPage(page - 1)}
          disabled={page <= 0}
        />
        <Pagination.Next onClick={() => setPage(page + 1)} />
      </Pagination>
    </>
  );
};

export default Results;
