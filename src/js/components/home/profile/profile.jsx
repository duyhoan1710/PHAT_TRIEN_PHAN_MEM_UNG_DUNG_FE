import React from 'react';
import {
  Avatar, makeStyles, TextField, InputAdornment,
} from '@material-ui/core';
import {
  Email, AccountCircle, Home, Phone, EventAvailable,
} from '@material-ui/icons';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';

import UpdateProfileDialog from './UpdateProfileDialog';
import { api } from '../../../helpers/axios';

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: '70%',
    height: 'auto',
    marginBottom: '20px',
  },
  button: {
    marginTop: 20,
    width: '70%',
    height: 'auto',
  },
  projectTitle: {
    marginBottom: 30,
  },
}));

const Profile = () => {
  const classes = useStyles();

  const { data: profile } = useQuery('me', async () => {
    const res = await api.get('/me');
    return res.data;
  }, {
    staleTime: 300000,
  });

  const { data: projects } = useQuery('projects create', async () => {
    const res = await api.get('/projects/created', {
      params: {
        limit: 100,
        offset: 0,
        sortBy: 'id',
        sortType: 'desc',
      },
    });

    return res.data;
  }, {
    staleTime: 300000,
  });

  if (profile && projects) {
    return (
      <>
        <Avatar src={profile.avatar} className={classes.large} />
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
          value={profile.email}
          disabled
        />
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          value={profile.full_name}
          disabled
        />
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Home />
              </InputAdornment>
            ),
          }}
          value={profile.address}
          disabled
        />
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            ),
          }}
          value={profile.phone}
          disabled
        />
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EventAvailable />
              </InputAdornment>
            ),
          }}
          value={dayjs(profile.birthday).format('MM/DD/YYYY')}
          disabled
        />
        <UpdateProfileDialog profile={profile} />
      </>
    );
  } return <></>;
};

export default Profile;
