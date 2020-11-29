import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  marginBottom: {
    marginBottom: 20,
  },
}));

const RepositoryTab = ({ value }) => {
  const classes = useStyles();

  return (
    <Tabs
      value={value}
      indicatorColor="primary"
      textColor="primary"
      className={classes.marginBottom}
    >
      <Tab
        value="me"
        label="My Repository"
        component={Link}
        to="/repository/me"
      />
      <Tab
        value="all"
        label="All Repository"
        component={Link}
        to="/repository/all"
      />
    </Tabs>
  );
};

RepositoryTab.propTypes = {
  value: PropTypes.string.isRequired,
};

export default RepositoryTab;
