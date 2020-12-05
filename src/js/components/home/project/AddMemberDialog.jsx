import React, { useState } from 'react';
import { useMutation, useQueryCache } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import useSearchUser from '../../../useQuery/useSearchUsers';
import { api } from '../../../helpers/axios';

const AddMemberDialog = ({ projectId }) => {
  const queryCache = useQueryCache();
  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit, control,
  } = useForm({
    mode: 'onChange',
  });

  const [keySearch, setKeySearch] = useState('');
  const { data: listUsers } = useSearchUser(keySearch);
  const handleSearchUser = debounce((val) => {
    setKeySearch(val);
  }, 500);

  const [isModalOpen, setIsOpenModal] = useState(false);

  const toggle = () => setIsOpenModal(!isModalOpen);

  const [handleAddMember, { isLoading }] = useMutation(
    async ({ members }) => {
      const membersId = members.map((member) => member.id);
      await api.post(`/projects/${projectId}/members`, {
        membersId,
      });
    },
    {
      onSuccess: () => {
        enqueueSnackbar('Create Project success', { variant: 'success' });
        queryCache.invalidateQueries('list members');
      },
      onError: (e) => {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      },
    },
  );

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggle}>
        Add Member
      </Button>
      <Dialog
        open={isModalOpen}
        aria-labelledby="form-dialog-title"
        fullWidth
        onClose={() => setIsOpenModal(false)}
      >
        <DialogTitle>Add Member</DialogTitle>
        <DialogContent>
          <Controller
            render={({ onChange, ...props }) => (
              <Autocomplete
                {...props}
                multiple
                filterSelectedOptions
                options={listUsers && listUsers.users ? listUsers.users : []}
                getOptionSelected={(option, values) => option.id === values.id}
                getOptionLabel={(option) => option.email}
                onInputChange={(_, values) => {
                  handleSearchUser(values);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Member"
                    placeholder="Member"
                  />
                )}
                onChange={(_, values) => onChange(values || [])}
              />
            )}
            name="members"
            control={control}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpenModal(!isModalOpen)} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleAddMember)} color="primary" disabled={isLoading} variant="contained">
            {isLoading ? 'Loading...' : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

AddMemberDialog.propTypes = {
  projectId: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
};

export default AddMemberDialog;
