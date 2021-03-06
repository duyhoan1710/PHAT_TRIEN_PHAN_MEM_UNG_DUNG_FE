import React from 'react';
import { useParams } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import Layout from '../components/common/Layout';
import TasksBoardComponent from '../components/home/project/TasksBoard';
import TaskTab from '../components/home/tasks/TaskTab';

const TasksBoard = () => {
  const { projectId } = useParams();
  return (
    <Layout>
      <TaskTab value="board" projectId={projectId} />
      <CssBaseline />
      <TasksBoardComponent />
    </Layout>
  );
};

export default TasksBoard;
