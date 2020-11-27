import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import {
  Form, FormGroup, Label, Input, Button, Alert,
} from 'reactstrap';
import { api } from '../../helpers/axios';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], "Password confirmation don't match!"),
  fullName: yup.string().required(),
});

const SignUp = () => {
  const history = useHistory();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const [errorMessage, setErrorMessage] = useState('');

  const [handleSignUp, { isLoading }] = useMutation(
    ({
      email,
      password,
      passwordConfirmation,
      fullName,
    }) => api.post('/sign-up', {
      email,
      password,
      passwordConfirmation,
      fullName,
    }),
    {
      onSuccess: () => {
        history.push('/sign-in');
      },
      onError: (e) => {
        setErrorMessage(e.response.data.message);
      },
    },
  );

  const onSubmit = ({
    email,
    password,
    passwordConfirmation,
    fullName,
  }) => {
    handleSignUp({
      email,
      password,
      passwordConfirmation,
      fullName,
    });
  };

  const showError = (type) => errors && errors[type] && <p className="text-danger">{errors[type].message}</p>;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup className="mt-3">
        <Label className="font-weight-bold">FullName</Label>
        <Input
          className="mb-2"
          placeholder="Full name"
          type="text"
          name="fullName"
          onChange={() => setErrorMessage('')}
          innerRef={register}
        />
        {showError('fullName')}
      </FormGroup>
      <FormGroup>
        <Label className="font-weight-bold">Email</Label>
        <Input
          className="mb-2"
          placeholder="Email"
          type="email"
          name="email"
          onChange={() => setErrorMessage('')}
          innerRef={register}
        />
        {showError('email')}
      </FormGroup>
      <FormGroup className="mt-3">
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
      <FormGroup className="mt-3">
        <Label className="font-weight-bold">Password Confirmation</Label>
        <Input
          className="mb-2"
          placeholder="password confirmation"
          type="password"
          name="passwordConfirmation"
          onChange={() => setErrorMessage('')}
          innerRef={register}
        />
        {showError('passwordConfirmation')}
      </FormGroup>
      <FormGroup>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Button className="btn btn-info btn-block mb-2" type="submit" disabled={isLoading}>
          { isLoading ? 'Loading...' : 'Submit' }
        </Button>
        <div className="text-center mb-3">
          <Link to="/sign-in">Has an account ? Click To Login</Link>
        </div>
      </FormGroup>
    </Form>
  );
};

export default SignUp;
