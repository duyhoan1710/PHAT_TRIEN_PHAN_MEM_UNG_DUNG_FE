import React from 'react';
import { Col, Row } from 'reactstrap';
import Layout from '../components/common/Layout';
import TasksBoardComponent from '../components/home/tasks/TasksBoard';

const TasksBoard = () => (
  <Layout>
    <Row className="justify-content-end">
      <Col className="col-11">
        <TasksBoardComponent />
      </Col>
    </Row>
  </Layout>
);

export default TasksBoard;
