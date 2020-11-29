import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useMutation, useQueryCache } from 'react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import { TextField, makeStyles, FormGroup } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import { api } from '../../../helpers/axios';

const schema = yup.object().shape({
  fullName: yup.string().required(),
  address: yup.string().nullable(),
  birthday: yup.string().nullable(),
  phone: yup.string().nullable(),
});

const useStyles = makeStyles(() => ({
  button: {
    marginTop: 20,
    width: '70%',
    height: 'auto',
  },
  marginBottom: {
    marginBottom: 20,
  },
}));

const UpdateProfileDialog = ({ profile }) => {
  const cache = useQueryCache();

  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const {
    register, errors, watch, handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const {
    fullName,
    phone,
    address,
    birthday,
  } = watch();

  const [handleUpdate] = useMutation(
    async () => {
      await api.put('/users', {
        fullName,
        phone,
        address,
        birthday,
      });
    },
    {
      onSuccess: () => {
        setOpen(false);
        enqueueSnackbar('Update Profile Success', { variant: 'success' });
        cache.invalidateQueries('me');
      },
      onError: (e) => {
        enqueueSnackbar(e.response.data.message, { variant: 'error' });
      },
    },
  );

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={() => setOpen(!open)} className={classes.button}>
        edit profile
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(!open)}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Update Profile</DialogTitle>
        <DialogContent>
          <FormGroup>
            <TextField
              label="Email"
              name="email"
              className={classes.marginBottom}
              defaultValue={profile.email}
              disabled
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              inputRef={register}
              label="Full Name"
              name="fullName"
              className={classes.marginBottom}
              defaultValue={profile.full_name}
              fullWidth
              helperText={errors.fullName ? errors.fullName.message : ''}
              error={!!errors.fullName}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              inputRef={register}
              label="Phone"
              name="phone"
              className={classes.marginBottom}
              defaultValue={profile.phone}
              fullWidth
              helperText={errors.phone ? errors.phone.message : ''}
              error={!!errors.phone}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              inputRef={register}
              label="Address"
              name="address"
              className={classes.marginBottom}
              defaultValue={profile.address}
              fullWidth
              helperText={errors.address ? errors.address.message : ''}
              error={!!errors.address}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              inputRef={register}
              label="Birthday"
              name="birthday"
              type="date"
              className={classes.marginBottom}
              defaultValue={dayjs(Date.parse(profile.birthday)).format('YYYY-MM-DD')}
              fullWidth
              helperText={errors.birthday ? errors.birthday.message : ''}
              error={!!errors.birthday}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(!open)} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleSubmit(handleUpdate)} color="primary" autoFocus variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

UpdateProfileDialog.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    full_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    birthday: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }).isRequired,
};

export default UpdateProfileDialog;
