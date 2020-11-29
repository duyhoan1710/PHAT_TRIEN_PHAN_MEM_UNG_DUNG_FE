import React from 'react';
import { CssBaseline, Grid } from '@material-ui/core';
import Layout from '../components/common/Layout';
import ProfileComponent from '../components/home/profile/profile';
import MyRepositoryComponent from '../components/home/profile/MyRepository';
import RepositoryTab from '../components/home/profile/RepositoryTab';

const MyRepository = () => (
  <Layout>
    <Grid container direction="row">
      <Grid item xs={4}>
        <ProfileComponent />
      </Grid>
      <Grid item xs={8}>
        <RepositoryTab value="me" />
        <CssBaseline />
        <MyRepositoryComponent />
      </Grid>
    </Grid>
  </Layout>
);

export default MyRepository;
