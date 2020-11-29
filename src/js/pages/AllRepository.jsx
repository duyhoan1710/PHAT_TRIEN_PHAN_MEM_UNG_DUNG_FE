import React from 'react';
import { CssBaseline, Grid } from '@material-ui/core';
import Layout from '../components/common/Layout';
import ProfileComponent from '../components/home/profile/profile';
import AllRepositoryComponent from '../components/home/profile/AllRepository';
import RepositoryTab from '../components/home/profile/RepositoryTab';

const AllRepository = () => (
  <Layout>
    <Grid container direction="row">
      <Grid item xs={4}>
        <ProfileComponent />
      </Grid>
      <Grid item xs={8}>
        <RepositoryTab value="all" />
        <CssBaseline />
        <AllRepositoryComponent />
      </Grid>
    </Grid>
  </Layout>
);

export default AllRepository;
