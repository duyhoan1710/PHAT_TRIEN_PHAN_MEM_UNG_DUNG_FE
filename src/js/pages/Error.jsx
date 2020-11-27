import React from 'react';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Alert,
  Container,
} from 'reactstrap';

const Error = () => (
  <Container>
    <Row className="justify-content-center">
      <Col className="col-9 mt-4 mr-4">
        <Alert color="danger">
          <h3>whoops !!! Something went wrong</h3>
          <p>Try to refresh page or click <Link to="/sign-in">here</Link> to back to sign-in page</p>
        </Alert>
      </Col>
    </Row>
  </Container>
);

export default Error;
