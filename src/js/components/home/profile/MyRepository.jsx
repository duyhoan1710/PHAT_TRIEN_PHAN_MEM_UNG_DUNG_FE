import React from 'react';
import {
  Grid, Card, CardContent, Typography, makeStyles,
} from '@material-ui/core';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

import { api } from '../../../helpers/axios';

const useStyles = makeStyles(() => ({
  cursor: {
    cursor: 'pointer',
  },
}));

const MyRepository = () => {
  const history = useHistory();

  const classes = useStyles();

  const { data: projects } = useQuery('my projects', async () => {
    const res = await api.get('/projects/created', {
      params: {
        limit: 100,
        offset: 0,
        sortBy: 'id',
        sortType: 'desc',
      },
    });

    return res.data;
  }, {
    staleTime: 300000,
  });

  const handleClick = (projectId) => {
    history.push(`/projects/${projectId}`);
  };

  if (projects) {
    return (
      <>
        <Grid container direction="row" spacing={3}>
          {
            projects && projects.projects.map((project) => (
              <Grid item xs={5} key={project.id} className={classes.cursor}>
                <Card onClick={() => handleClick(project.id)}>
                  <CardContent>
                    <Typography variant="h5" component="h2" style={{ marginBottom: 15 }}>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {dayjs(project.created_at).format('DD/MM/YYYY hh:mm')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          }
        </Grid>

      </>
    );
  } return <></>;
};

export default MyRepository;
