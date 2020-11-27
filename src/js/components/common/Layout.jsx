import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Grid, CssBaseline, makeStyles } from '@material-ui/core';
import Header from './Header';
import SideBar from './SideBar';
import Footer from './Footer';

import { api } from '../../helpers/axios';

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flex: 1,
    height: '100vh',
    overflow: 'auto',
    paddingTop: theme.spacing(3),
    backgroundColor: theme.palette.background.dark,
  },
  mainContent: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const Layout = ({ children }) => {
  const classes = useStyles();

  const { data } = useQuery('me', async () => {
    const res = await api.get('/me');
    return res.data;
  }, {
    staleTime: 300000,
  });

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  if (data) {
    return (
      <>
        <CssBaseline />
        <Header open={open} handleOpen={handleOpen} />
        <Grid container direction="row">
          <SideBar open={open} handleClose={handleClose} />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />

            <div className={classes.mainContent}>
              {children}
            </div>
          </main>
        </Grid>
        <Footer />
      </>
    );
  } return <></>;
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
