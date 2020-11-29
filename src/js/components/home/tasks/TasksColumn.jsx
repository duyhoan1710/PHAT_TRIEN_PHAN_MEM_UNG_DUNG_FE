import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import { makeStyles } from '@material-ui/core';

import Task from './Task';
import { api } from '../../../helpers/axios';
import taskStatus from '../../../enums/taskStatus';

const useStyles = makeStyles(() => ({
  overflow: {
    overflowX: 'hidden',
    overflowY: 'scroll',
    height: '60vh',
  },
}));

const TaskColumn = ({ droppableId, projectId }) => {
  const classes = useStyles();

  const limit = 10;
  let offset = 0;
  let tasks = [];
  const ref = useRef(null);
  const fetchTasks = async (key, nextId = 0) => {
    const res = await api
      .get(`/projects/${projectId}/tasks`, {
        params: {
          status: taskStatus.getValue(droppableId),
          offset: nextId,
          limit,
        },
      });
    return res.data;
  };

  const { data, fetchMore } = useInfiniteQuery(`${droppableId}`, fetchTasks);

  if (data) {
    data.forEach((group) => {
      tasks = [...tasks, ...group];
    });
  }

  const handleScroll = async (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight === scrollHeight) {
      offset += limit;
      await fetchMore(offset);
    }
  };

  useEffect(() => {
    ref.current.addEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Droppable droppableId={droppableId} isCombineEnabled>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={classes.overflow}
        >
          <div
            ref={ref}
          >
            {
              tasks && tasks.map((task, index) => (
                <Task
                  projectId={projectId}
                  droppableId={droppableId}
                  task={{
                    id: task.id,
                    name: task.name,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    distribute: task.distribute,
                    createdAt: task.created_at,
                  }}
                  created={{
                    id: task.created_id,
                    fullName: task.created_name,
                    email: task.created_email,
                    avatar: task.created_avatar,
                  }}
                  updated={{
                    id: task.updated_id,
                    fullName: task.updated_name,
                    email: task.updated_email,
                    avatar: task.updated_avatar,
                  }}
                  assign={{
                    id: task.assign_id,
                    fullName: task.assign_name,
                    email: task.assign_email,
                    avatar: task.assign_avatar,
                  }}
                  key={task.id}
                  index={index}
                />
              ))
            }
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

TaskColumn.propTypes = {
  statusTitle: PropTypes.string.isRequired,
  droppableId: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default TaskColumn;
