import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  marginBottom: {
    marginBottom: 5,
  },
}));

const TaskTab = ({ value, projectId }) => {
  const classes = useStyles();

  return (
    <Tabs
      value={value}
      indicatorColor="primary"
      textColor="primary"
      className={classes.marginBottom}
    >
      <Tab
        value="board"
        label="Board"
        component={Link}
        to={`/projects/${projectId}/board`}
      />
      <Tab
        value="member"
        label="Member"
        component={Link}
        to={`/projects/${projectId}/member`}
      />
      <Tab
        value="setting"
        label="Setting"
        component={Link}
        to={`/projects/${projectId}/setting`}
      />
    </Tabs>
  );
};

TaskTab.propTypes = {
  value: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default TaskTab;
