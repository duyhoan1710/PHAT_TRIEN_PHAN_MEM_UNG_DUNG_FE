import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { Grid, makeStyles } from '@material-ui/core';

import TaskColumn from '../tasks/TasksColumn';
import CreateDialog from '../tasks/CreateDialog';
import taskStatus from '../../../enums/taskStatus';

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

  const onDragEnd = (result) => result;

  const { projectId } = useParams();

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
