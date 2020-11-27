import React from 'react';
import { Col, Row } from 'reactstrap';
import Layout from '../components/common/Layout';
import ProjectsBoard from '../components/home/projects/ProjectsBoard';

const Home = () => (
  <Layout>
    <Row>
      <Col>
        <ProjectsBoard />
      </Col>
    </Row>
  </Layout>
);

export default Home;
