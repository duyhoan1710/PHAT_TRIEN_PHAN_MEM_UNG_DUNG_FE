import React, { useState } from 'react';
import { useMutation, useQueryCache } from 'react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from 'reactstrap';

import { api } from '../../../helpers/axios';

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().nullable(),
});

const CreateDialog = () => {
  const queryCache = useQueryCache();

  const { handleSubmit, register, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const toggle = () => setIsOpenModal(!isOpenModal);

  const [handleCreateTask] = useMutation(
    ({ name, description }) => api.post('/projects', { name, description }),
    {
      onSuccess: () => {
        queryCache.invalidateQueries('projects');
        toggle();
      },
      onError: (e) => {
        setErrorMessage(e.response.data.message);
      },
    },
  );
  const onSubmit = ({ name, description }) => {
    handleCreateTask({ name, description });
  };

  const showError = (type) => errors && errors[type] && <p className="text-danger">{errors[type].message}</p>;

  return (
    <>
      <Button color="primary" onClick={toggle}>New Project</Button>
      <Modal isOpen={isOpenModal} toggle={toggle}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggle}>Create New Project</ModalHeader>
          <ModalBody>
            <FormGroup className="mt-3">
              <Label className="font-weight-bold">Name</Label>
              <Input
                className="mb-2"
                placeholder="Name"
                name="name"
                onChange={() => setErrorMessage('')}
                innerRef={register}
              />
              {showError('name')}
            </FormGroup>
            <FormGroup>
              <Label className="font-weight-bold">Description</Label>
              <Input
                className="mb-2"
                type="textarea"
                placeholder="Description"
                name="description"
                onChange={() => setErrorMessage('')}
                innerRef={register}
              />
              {showError('description')}
              {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="success">Submit</Button>
            <Button color="danger" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default CreateDialog;
