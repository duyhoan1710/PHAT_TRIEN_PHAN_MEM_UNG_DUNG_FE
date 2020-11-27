import React from 'react';
import { Row } from 'reactstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';

import TaskColumn from './TasksColumn';
import CreateDialog from './CreateDialog';
import taskStatus from '../../../enums/taskStatus';

const Board = () => {
  const onDragEnd = (result) => result;

  const { projectId } = useParams();

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <Row className="mt-3 mb-3">
        <h3 className="mr-3">Task Board</h3>
        <CreateDialog projectId={projectId} />
      </Row>
      <Row>
        {
          taskStatus.getKeys().map((status) => (
            <TaskColumn
              statusTitle={status}
              droppableId={status}
              projectId={projectId}
              key={status}
            />
          ))
        }
      </Row>
    </DragDropContext>
  );
};

export default Board;
