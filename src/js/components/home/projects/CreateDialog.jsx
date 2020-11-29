import React, { useState } from 'react';
import { useMutation, useQueryCache } from 'react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormGroup,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import { api } from '../../../helpers/axios';

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().nullable(),
});

const CreateDialog = () => {
  const queryCache = useQueryCache();

  const { enqueueSnackbar } = useSnackbar();

  const {
    register, errors, watch, handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const {
    name, description,
  } = watch();

  const [isModalOpen, setIsOpenModal] = useState(false);

  const toggle = () => setIsOpenModal(!isModalOpen);

  const [handleCreateTask, { isLoading }] = useMutation(
    async () => {
      await api.post('/projects', { name, description });
    },
    {
      onSuccess: () => {
        toggle();
        enqueueSnackbar('Create Project success', { variant: 'success' });
        queryCache.invalidateQueries('projects');
      },
      onError: (e) => {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      },
    },
  );

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggle}>
        New Project
      </Button>
      <Dialog
        open={isModalOpen}
        aria-labelledby="form-dialog-title"
        fullWidth
        onClose={() => setIsOpenModal(false)}
      >
        <DialogTitle>Accept Overtime</DialogTitle>
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
              fullWidth
              variant="outlined"
              inputRef={register}
              error={!!errors.description}
              helperText={errors.description ? errors.description.message : ''}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpenModal(!isModalOpen)} color="secondary" variant="contained">
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

export default CreateDialog;
