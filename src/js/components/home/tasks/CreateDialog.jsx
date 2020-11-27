import React, { useState } from 'react';
import { useMutation, useQueryCache } from 'react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import PropTypes from 'prop-types';
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
import taskPriority from '../../../enums/taskPriority';

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().nullable(),
  priority: yup.number().oneOf(
    taskPriority.getValues(),
  ),
});

const CreateDialog = ({ projectId }) => {
  const queryCache = useQueryCache();

  const { handleSubmit, register, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const toggle = () => setIsOpenModal(!isOpenModal);

  const [handleCreateTask] = useMutation(
    ({ name, description, priority }) => api.post(`/projects/${projectId}/tasks`, { name, description, priority }),
    {
      onSuccess: () => {
        queryCache.invalidateQueries('PENDING');
        toggle();
      },
      onError: (e) => {
        setErrorMessage(e.response.data.message);
      },
    },
  );
  const onSubmit = ({ name, description, priority }) => {
    handleCreateTask({ name, description, priority });
  };

  const showError = (type) => errors && errors[type] && <p className="text-danger">{errors[type].message}</p>;

  return (
    <>
      <Button color="primary" onClick={toggle}>New Task</Button>
      <Modal isOpen={isOpenModal} toggle={toggle}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggle}>Create New Task</ModalHeader>
          <ModalBody>
            <FormGroup className="mt-3">
              <Label className="font-weight-bold">name</Label>
              <Input
                className="mb-2"
                placeholder="name"
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
            <FormGroup>
              <Label className="font-weight-bold">Priority</Label>
              <Input
                className="mb-2"
                type="select"
                placeholder="Priority"
                name="priority"
                onChange={() => setErrorMessage('')}
                innerRef={register}
              >
                {taskPriority && taskPriority.getValues().map((priority) => (
                  <option value={priority} key={priority}>{taskPriority.getKey(priority)}</option>
                ))}
              </Input>
              {showError('priority')}
            </FormGroup>
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
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

CreateDialog.propTypes = {
  projectId: PropTypes.string.isRequired,
};

export default CreateDialog;
