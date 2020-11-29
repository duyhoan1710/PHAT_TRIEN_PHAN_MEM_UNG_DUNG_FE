import React from 'react';
import { useParams } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import Layout from '../components/common/Layout';
import MemberBoardComponent from '../components/home/project/MemberBoard';
import TaskTab from '../components/home/tasks/TaskTab';

const TasksBoard = () => {
  const { projectId } = useParams();
  return (
    <Layout>
      <TaskTab value="member" projectId={projectId} />
      <CssBaseline />
      <MemberBoardComponent projectId={projectId} />
    </Layout>
  );
};

export default TasksBoard;
