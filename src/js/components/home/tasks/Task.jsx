import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import {
  Card, CardContent, Typography, makeStyles, Avatar,
} from '@material-ui/core';
import AssignmentReturnedIcon from '@material-ui/icons/AssignmentReturned';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import dayjs from 'dayjs';

import Popover from '../../common/Popover';
import UpdateDialog from './UpdateDialog';
import colorDistribute from '../../../enums/colorDistribute';
import colorPriority from '../../../enums/colorPriority';

const useStyles = makeStyles((theme) => ({
  task: {
    height: 120,
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    height: '90%',
    width: '90%',
    marginBottom: 10,
    paddingBottom: 0,
  },
  footer: {
    display: 'flex',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));
function Task({
  task: {
    id, name, description, priority, status, distribute, createdAt,
  },
  created, updated, assign, index, droppableId, projectId,
}) {
  const classes = useStyles();

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <Draggable
      draggableId={JSON.stringify({
        id, name, description, status, priority,
      })}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classes.task}
        >
          <Card onClick={toggle} className={classes.card}>
            <CardContent>
              <Typography color="textSecondary" component="h4">
                <Popover text={name} />
              </Typography>
              <Typography color="textSecondary">
                <AssignmentReturnedIcon color={`${colorDistribute.getKey(distribute).toLocaleLowerCase()}`} />
                <ArrowUpwardIcon style={{ color: colorPriority.getKey(priority) }} />
              </Typography>
              <Typography color="textSecondary" className={classes.footer}>
                {dayjs(createdAt).format('MM-DD-YYYY')}
                <div style={{ flexGrow: 1 }} />
                <Avatar src={assign.avatar} className={classes.small} />
              </Typography>
            </CardContent>
          </Card>
          <UpdateDialog
            isDialogOpen={modal}
            toggle={toggle}
            sourceDroppable={droppableId}
            projectId={projectId}
            task={{
              id, name, description, status, priority, distribute,
            }}
            created={created}
            updated={updated}
            assign={assign}
          />
        </div>
      )}
    </Draggable>
  );
}

Task.propTypes = {
  index: PropTypes.number.isRequired,
  droppableId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    priority: PropTypes.number.isRequired,
    status: PropTypes.number.isRequired,
    distribute: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  created: PropTypes.shape({
    id: PropTypes.number.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  updated: PropTypes.shape({
    id: PropTypes.number.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  assign: PropTypes.shape({
    id: PropTypes.number.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
};

export default Task;
