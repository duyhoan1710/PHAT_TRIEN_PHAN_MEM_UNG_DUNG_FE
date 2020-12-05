import React, { useState } from 'react';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import PropTypes from 'prop-types';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button,
  TextField, FormGroup, MenuItem, Select, InputLabel, FormControl,
  FormHelperText, Avatar, Typography, makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import { api } from '../../../helpers/axios';
import taskPriority from '../../../enums/taskPriority';
import taskDistribute from '../../../enums/taskDistribute';

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().nullable(),
  priority: yup.number().oneOf(
    taskPriority.getValues(),
  ).required(),
  distribute: yup.number().oneOf(
    taskDistribute.getValues(),
  ).required(),
  assignId: yup.number().nullable(),
});

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(1),
  },
}));

const CreateDialog = ({ projectId }) => {
  const queryCache = useQueryCache();

  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit, register, errors, control,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const [isOpenModal, setIsOpenModal] = useState(false);

  const toggle = () => setIsOpenModal(!isOpenModal);

  const { data: getListMember } = useQuery('list member', async () => {
    const res = await api.get(`/projects/${projectId}/members`, {
      params: {
        offset: 0,
        limit: 100,
      },
    });
    return res.data;
  });

  const [handleCreateTask, { isLoading }] = useMutation(
    ({
      name, description, priority, distribute, assignId,
    }) => api.post(`/projects/${projectId}/tasks`, {
      name, description, priority, distribute, assignId,
    }),
    {
      onSuccess: () => {
        enqueueSnackbar('Create Task Success', { variant: 'success' });
        queryCache.invalidateQueries('PENDING');
        toggle();
      },
      onError: (e) => {
        enqueueSnackbar(e.data.response.message, { variant: 'error' });
      },
    },
  );

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggle}>New Task</Button>
      <Dialog
        open={isOpenModal}
        aria-labelledby="form-dialog-title"
        fullWidth
        onClose={() => setIsOpenModal(false)}
      >
        <DialogTitle toggle={toggle}>Create New Task</DialogTitle>
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
              fullWidth
              variant="outlined"
              inputRef={register}
              error={!!errors.description}
              helperText={errors.description ? errors.description.message : ''}
            />

            <FormControl
              variant="outlined"
              error={!!errors.distribute}
              style={{
                marginBottom: 20,
              }}
            >
              <InputLabel>Distribute</InputLabel>
              <Controller
                as={(
                  <Select label="Distribute">
                    {taskDistribute.getValues().map((distribute) => (
                      <MenuItem key={distribute} value={distribute}>
                        {taskDistribute.getKey(distribute)}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name="distribute"
                inputRef={register}
                control={control}
              />
              <FormHelperText>{errors.distribute ? errors.distribute.message : ''}</FormHelperText>
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
                name="priority"
                inputRef={register}
                control={control}
              />
              <FormHelperText>{errors.priority ? errors.priority.message : ''}</FormHelperText>
            </FormControl>

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
                name="assignId"
                inputRef={register}
                control={control}
              />
              <FormHelperText>{errors.assignId ? errors.assignId.message : ''}</FormHelperText>
            </FormControl>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpenModal(!isOpenModal)} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleCreateTask)} color="primary" autoFocus disabled={isLoading} variant="contained">
            {isLoading ? 'Loading...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

CreateDialog.propTypes = {
  projectId: PropTypes.string.isRequired,
};

export default CreateDialog;
