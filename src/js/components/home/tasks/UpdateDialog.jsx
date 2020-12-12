/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useMutation, useQueryCache, useQuery } from 'react-query';
import { yupResolver } from '@hookform/resolvers';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, makeStyles, Typography,
  TextField, FormGroup, MenuItem, Select, InputLabel, FormControl, FormHelperText, Avatar,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import taskStatus from '../../../enums/taskStatus';
import taskPriority from '../../../enums/taskPriority';
import { api } from '../../../helpers/axios';
import taskDistribute from '../../../enums/taskDistribute';

const schema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  status: yup.number().oneOf(
    taskStatus.getValues(),
  ),
  priority: yup.number().oneOf(
    taskPriority.getValues(),
  ),
  assignId: yup.number().nullable(),
});

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(1),
  },
}));

const UpdateDialog = ({
  projectId,
  isDialogOpen,
  toggle,
  sourceDroppable,
  task,
}) => {
  const queryCache = useQueryCache();

  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit, register, errors, control, watch,
  } = useForm({
    yupResolver: yupResolver(schema),
    mode: 'onChange',
  });

  const { status } = watch();

  const { data: getListMember } = useQuery('list member', async () => {
    const res = await api.get(`/projects/${projectId}/members`, {
      params: {
        offset: 0,
        limit: 100,
      },
    });
    return res.data;
  });

  const [handleUpdateTask, { isLoading }] = useMutation(
    async ({
      name,
      description,
      status,
      priority,
      assignId,
    }) => {
      await api.put(`projects/${projectId}/tasks/${task.id}`, {
        name,
        description,
        status,
        priority,
        assignId,
      });
    },
    {
      onSuccess: () => {
        enqueueSnackbar('Update Task Success', { variant: 'success' });
        const destinationDroppable = taskStatus.getKey(status);
        // refresh source droppable
        queryCache.invalidateQueries(sourceDroppable);
        // refresh destination droppable
        queryCache.invalidateQueries(destinationDroppable);

        toggle();
      },
      onError: (error) => {
        enqueueSnackbar(error.data.response.message, { variant: 'error' });
      },
    },
  );

  return (
    <Dialog
      open={isDialogOpen}
      aria-labelledby="form-dialog-title"
      fullWidth
      onClose={toggle}
    >
      <DialogTitle>Update Task</DialogTitle>
      <DialogContent>
        <FormGroup>
          <TextField
            label="Name"
            name="name"
            fullWidth
            variant="outlined"
            style={{
              marginBottom: 20,
            }}
            defaultValue={task.name}
            inputRef={register}
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ''}
          />

          <TextField
            rows={4}
            multiline
            label="Description"
            name="description"
            style={{
              marginBottom: 20,
            }}
            defaultValue={task.description}
            fullWidth
            variant="outlined"
            inputRef={register}
            error={!!errors.description}
            helperText={errors.description ? errors.description.message : ''}
          />

          <FormControl
            variant="outlined"
            error={!!errors.status}
            style={{
              marginBottom: 20,
            }}
          >
            <InputLabel>Status</InputLabel>
            <Controller
              as={(
                <Select label="Status">
                  {taskStatus.getValues().map((status) => (
                    <MenuItem key={status} value={status}>
                      {taskStatus.getKey(status)}
                    </MenuItem>
                  ))}
                </Select>
                )}
              name="status"
              defaultValue={task.status}
              inputRef={register}
              control={control}
            />
            <FormHelperText>{errors.status ? errors.status.message : ''}</FormHelperText>
          </FormControl>

          <FormControl
            variant="outlined"
            error={!!errors.priority}
            style={{
              marginBottom: 20,
            }}
          >
            <InputLabel>Priority</InputLabel>
            <Controller
              as={(
                <Select label="Priority">
                  {taskPriority.getValues().map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {taskPriority.getKey(priority)}
                    </MenuItem>
                  ))}
                </Select>
                )}
              defaultValue={task.priority}
              name="priority"
              inputRef={register}
              control={control}
            />
            <FormHelperText>{errors.priority ? errors.priority.message : ''}</FormHelperText>
          </FormControl>

          <TextField
            label="Distribute"
            name="distribute"
            fullWidth
            variant="outlined"
            style={{
              marginBottom: 20,
            }}
            defaultValue={taskDistribute.getKey(task.distribute)}
            inputRef={register}
            disabled
          />

          <FormControl
            variant="outlined"
            error={!!errors.assignId}
          >
            <InputLabel>Assign</InputLabel>
            <Controller
              as={(
                <Select label="Assign">
                  {
                    getListMember && getListMember.members.map((member) => (
                      <MenuItem key={member.id} value={member.id}>
                        <div style={{ display: 'flex' }}>
                          <Avatar src={member.avatar} className={classes.small} />
                          <Typography>{member.email}</Typography>
                        </div>
                      </MenuItem>
                    ))
                  }
                </Select>
                )}
              defaultValue={task.assign_id}
              name="assignId"
              inputRef={register}
              control={control}
              style={{
                marginBottom: 20,
              }}
            />
            <FormHelperText>{errors.assignId ? errors.assignId.message : ''}</FormHelperText>
          </FormControl>

          <TextField
            label="Created By"
            name="created"
            fullWidth
            variant="outlined"
            style={{
              marginBottom: 20,
            }}
            InputProps={{
              startAdornment: <Avatar src={task.created_avatar} className={classes.small} />,
            }}
            defaultValue={task.created_email}
            inputRef={register}
            disabled
          />

          <TextField
            label="Last Updated"
            name="updated"
            fullWidth
            variant="outlined"
            style={{
              marginBottom: 20,
            }}
            InputProps={{
              startAdornment: <Avatar src={task.updated_avatar} className={classes.small} />,
            }}
            defaultValue={task.updated_email}
            inputRef={register}
            disabled
          />

        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => toggle()} color="secondary" variant="contained">
          Cancel
        </Button>
        <Button onClick={handleSubmit(handleUpdateTask)} color="primary" autoFocus disabled={isLoading} variant="contained">
          {isLoading ? 'Loading...' : 'Approve'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UpdateDialog.propTypes = {
  task: PropTypes.object.isRequired,
  sourceDroppable: PropTypes.string.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default UpdateDialog;
