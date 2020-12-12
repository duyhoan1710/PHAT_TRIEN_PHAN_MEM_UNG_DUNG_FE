import React from 'react';
import { useMutation, useQueryCache } from 'react-query';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, DialogContentText,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { api } from '../../helpers/axios';

const ConfirmDialog = ({
  toggle, isDialogOpen, title, content, data,
}) => {
  const queryCache = useQueryCache();
  const { enqueueSnackbar } = useSnackbar();

  const [handleSubmit, { isLoading }] = useMutation(
    async () => {
      await api.delete(`/projects/${data.projectId}/members/${data.memberId}`);
    },
    {
      onSuccess: () => {
        if (data.queryCache) queryCache.invalidateQueries(data.queryCache);
        toggle();
        enqueueSnackbar('Remove user from project success', { variant: 'success' });
      },
      onError: (e) => {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      },
    },
  );

  return (
    <>
      <Button onClick={toggle}>
        <DeleteForeverIcon color="primary" style={{ fontSize: 30 }} />
      </Button>
      <Dialog
        open={isDialogOpen}
        aria-labelledby="form-dialog-title"
        fullWidth
        onClose={toggle}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggle} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus disabled={isLoading} variant="contained">
            {isLoading ? 'Loading...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </>

  );
};

ConfirmDialog.propTypes = {
  toggle: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  data: PropTypes.shape({
    projectId: PropTypes.string.isRequired,
    memberId: PropTypes.number.isRequired,
    queryCache: PropTypes.string,
  }).isRequired,
};

export default ConfirmDialog;
