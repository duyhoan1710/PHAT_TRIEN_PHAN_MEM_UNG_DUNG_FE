import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { Grid, makeStyles } from '@material-ui/core';
import { useMutation, useQueryCache } from 'react-query';

import TaskColumn from '../tasks/TasksColumn';
import CreateDialog from '../tasks/CreateDialog';
import taskStatus from '../../../enums/taskStatus';
import { api } from '../../../helpers/axios';

const useStyles = makeStyles(() => ({
  flexEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  tableColumn: {
    border: '2px solid #999',
    borderRadius: 5,
    marginRight: 20,
    width: 'calc(100% / 4.5)',
  },
}));

const Board = () => {
  const classes = useStyles();

  const { projectId } = useParams();

  const queryCache = useQueryCache();

  const [draggEndResult, setDraggEndResult] = useState({});

  const [handleUpdate] = useMutation(async ({
    id, name, description, status, priority, assignId,
  }) => {
    await api.put(`projects/${projectId}/tasks/${id}`, {
      name, description, status, priority, assignId,
    });
  }, {
    onSuccess: () => {

    },
    onError: () => {

    },
  });

  const onDragEnd = async (result) => {
    if (result && result.destination && result.destination.droppableId) {
      const sourceTask = JSON.parse(result.draggableId);
      await handleUpdate({
        id: sourceTask.id,
        name: sourceTask.name,
        description: sourceTask.description,
        status: taskStatus.getValue(result.destination.droppableId),
        priority: sourceTask.priority,
        assignId: sourceTask.assign_id,
      });

      queryCache.invalidateQueries(result.source.droppableId);
      queryCache.invalidateQueries(result.destination.droppableId);

      setDraggEndResult({
        source: result.source,
        destination: result.destination,
        sourceTask,
      });
    }
  };

  return (
    <>
      <div className={classes.flexEnd}>
        <CreateDialog projectId={projectId} />
      </div>
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <Grid container>
          {
          taskStatus.getKeys().map((status) => (
            <Grid item className={classes.tableColumn} key={status}>
              <div
                className="text-center bg-light"
                style={
                  { fontSize: 20, padding: 10 }
                }
              >
                {status.toLocaleLowerCase()}
              </div>
              <TaskColumn
                statusTitle={status}
                droppableId={status}
                projectId={projectId}
                draggEndResult={draggEndResult}
                setDraggEndResult={setDraggEndResult}
                key={status}
              />
            </Grid>
          ))
        }
        </Grid>
      </DragDropContext>
    </>

  );
};

export default Board;
