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
  task, index, droppableId, projectId,
}) {
  const classes = useStyles();

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <Draggable
      draggableId={JSON.stringify(task)}
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
                <Popover text={task.name} />
              </Typography>
              <Typography color="textSecondary">
                <AssignmentReturnedIcon color={`${colorDistribute.getKey(task.distribute).toLocaleLowerCase()}`} />
                <ArrowUpwardIcon style={{ color: colorPriority.getKey(task.priority) }} />
              </Typography>
              <div color="textSecondary" className={classes.footer}>
                {dayjs(task.created_at).format('MM-DD-YYYY')}
                <div style={{ flexGrow: 1 }} />
                <Avatar src={task.assign_avatar} className={classes.small} />
              </div>
            </CardContent>
          </Card>
          <UpdateDialog
            isDialogOpen={modal}
            toggle={toggle}
            sourceDroppable={droppableId}
            projectId={projectId}
            task={task}
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
  task: PropTypes.object.isRequired,
};

export default Task;
