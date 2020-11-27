import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import Task from './Task';
import { api } from '../../../helpers/axios';
import taskStatus from '../../../enums/taskStatus';

const Div = styled.div`
  height: 75vh;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const TaskColumn = ({ statusTitle, droppableId, projectId }) => {
  const limit = 10;
  let offset = 0;
  let tasks = [];
  const ref = useRef(null);
  const fetchTasks = async (key, nextId = 0) => {
    const res = await api
      .get(`/projects/${projectId}/tasks?status=${taskStatus.getValue(droppableId)}&offset=${nextId}&limit=${limit}`);
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
          className="col-2 border bg-light"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <h4 className="pt-3 pb-1">{statusTitle}</h4>
          <Div ref={ref}>
            {
              tasks && tasks.map((task, index) => (
                <Task
                  droppableId={droppableId}
                  task={task}
                  key={task.id}
                  index={index}
                />
              ))
            }
          </Div>
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
