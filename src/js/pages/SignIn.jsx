import React from 'react';
import { Row, Col } from 'reactstrap';
import SignInComponent from '../components/auth/SignIn';

const SignIn = () => (
  <Row className="justify-content-center">
    <Col xs="10" sm="8" md="6" lg="4" className="shadow-lg mt-5">
      <SignInComponent />
    </Col>
  </Row>
);

export default SignIn;
