import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import {
  Form, FormGroup, Label, Input, Button, Alert,
} from 'reactstrap';
import { setToken, api } from '../../helpers/axios';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const SignIn = () => {
  const history = useHistory();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const [errorMessage, setErrorMessage] = useState('');

  const [handleSignIn, { isLoading }] = useMutation(
    ({ email, password }) => api.post('/sign-in', { email, password }),
    {
      onSuccess: (res) => {
        setToken(res.data.accessToken);
        history.push('/');
      },
      onError: () => {
        setErrorMessage('Email or password is incorrect');
      },
    },
  );

  const onSubmit = ({ email, password }) => {
    handleSignIn({ email, password });
  };

  const showError = (type) => errors && errors[type] && <p className="text-danger">{errors[type].message}</p>;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup className="mt-3">
        <Label className="font-weight-bold">Email</Label>
        <Input
          className="mb-2"
          placeholder="Email"
          type="text"
          name="email"
          onChange={() => setErrorMessage('')}
          innerRef={register}
        />
        {showError('email')}
      </FormGroup>
      <FormGroup>
        <Label className="font-weight-bold">Password</Label>
        <Input
          className="mb-2"
          placeholder="Password"
          type="password"
          name="password"
          onChange={() => setErrorMessage('')}
          innerRef={register}
        />
        {showError('password')}
      </FormGroup>
      {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
      <Button className="btn btn-info btn-block mb-2" type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </Button>
      <div className="text-center mb-3">
        <Link to="/sign-up">Not registered ? Create an account</Link>
      </div>
    </Form>
  );
};

export default SignIn;
