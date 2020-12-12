import React, { useEffect, useState } from 'react';
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

const TaskColumn = ({
  droppableId, projectId, draggEndResult, setDraggEndResult,
}) => {
  const classes = useStyles();

  const limit = 10;
  let offset = 0;
  const [tasks, setTasks] = useState(null);

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

  useEffect(() => {
    if (data) {
      if (
        data.length < 2
        || JSON.stringify(data[data.length - 1]) !== JSON.stringify(data[data.length - 2])
      ) {
        let newTasks = [];
        data.forEach((group) => {
          newTasks = [...newTasks, ...group];
        });

        setTasks(newTasks);
      }
    }
  }, [data]);

  useEffect(() => {
    if (
      draggEndResult
      && draggEndResult.sourceTask
      && draggEndResult.destination.droppableId === droppableId
    ) {
      const copyTasks = [...tasks];
      copyTasks.splice(draggEndResult.destination.index, 0, draggEndResult.sourceTask);
      setTasks(copyTasks);
      setDraggEndResult({});
    }
  }, [draggEndResult, droppableId, setDraggEndResult, tasks]);

  useEffect(() => {
    if (
      draggEndResult
      && draggEndResult.source
      && draggEndResult.source.droppableId === droppableId
    ) {
      const copyTasks = [...tasks];
      copyTasks.splice(draggEndResult.source.index, 1);
      setTasks(copyTasks);
      setDraggEndResult({});
    }
  }, [draggEndResult, droppableId, setDraggEndResult, tasks]);

  const handleScroll = async (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight === scrollHeight) {
      offset += limit;
      await fetchMore(offset);
    }
  };

  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={classes.overflow}
          onScroll={handleScroll}
        >
          {
              tasks && tasks.map((task, index) => (
                <Task
                  projectId={projectId}
                  droppableId={droppableId}
                  task={task}
                  key={task.id}
                  index={index}
                />
              ))
            }
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
  draggEndResult: PropTypes.object.isRequired,
  setDraggEndResult: PropTypes.func.isRequired,
};

export default TaskColumn;
