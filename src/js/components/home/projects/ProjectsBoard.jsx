import React from 'react';
import { useQuery } from 'react-query';
import { Table, Row } from 'reactstrap';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { api } from '../../../helpers/axios';
import CreateDialog from './CreateDialog';

const Cursor = styled.div`
  cursor: pointer;
`;
const ProjectBoard = () => {
  const history = useHistory();

  const { data } = useQuery('projects', async () => {
    const res = await api.get('/projects?offset=0&limit=10');
    return res.data;
  });

  const onClick = (projectId) => {
    history.push(`/projects/${projectId}/tasks`);
  };

  if (data) {
    return (
      <>
        <Row className="mt-3 mb-3">
          <h3 className="mr-3">Project</h3>
          <CreateDialog />
        </Row>
        <div>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Created By</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {
                data.projects.map((project) => (
                  <tr key={project.id}>
                    <th>{project.id}</th>
                    <th onClick={() => onClick(project.id)} className="text-primary">
                      <Cursor>{project.name}</Cursor>
                    </th>
                    <th>{project.description}</th>
                    <th>{project.full_name}</th>
                    <th>{dayjs(project.created_at).format('DD/MM/YYYY hh:mm')}</th>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>
      </>
    );
  } return <></>;
};

export default ProjectBoard;
