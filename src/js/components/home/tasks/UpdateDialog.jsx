import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useMutation, useQueryCache } from 'react-query';
import { yupResolver } from '@hookform/resolvers';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from 'reactstrap';

import taskStatus from '../../../enums/taskStatus';
import { api } from '../../../helpers/axios';

const schema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().nullable(),
  status: yup.number().oneOf(
    taskStatus.getValues(),
  ),
});

function UpdateDialog({
  modal,
  toggle,
  sourceDroppable,
  id,
  currentTitle,
  currentDescription,
}) {
  const queryCache = useQueryCache();

  const { handleSubmit, register, errors } = useForm({
    yupResolver: yupResolver(schema),
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [destinationDroppable, setDestinationDroppable] = useState(null);
  const [handleUpdateTask] = useMutation(
    ({
      taskId,
      title,
      description,
      status,
    }) => api.put(`/tasks/${taskId}`, {
      title,
      description,
      status,
    }),
    {
      onSuccess: () => {
        // refresh source droppable
        queryCache.invalidateQueries(sourceDroppable);
        // refresh destination droppable
        queryCache.invalidateQueries(destinationDroppable);

        toggle();
      },
      onError: (error) => {
        setErrorMessage(error.response.data.message);
      },
    },
  );

  const onSubmit = ({
    taskId,
    title,
    description,
    status,
  }) => {
    const droppableStatus = taskStatus.getKey(Number(status));
    setDestinationDroppable(droppableStatus);
    handleUpdateTask({
      taskId,
      title,
      description,
      status: Number(status),
    });
  };

  const showError = (type) => errors && errors[type] && <p className="text-danger">{errors[type].message}</p>;

  return (
    <Modal isOpen={modal} toggle={toggle}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader toggle={toggle}>Update Task</ModalHeader>
        <ModalBody>
          <FormGroup className="mt-3">
            <Input type="hidden" name="taskId" value={id} innerRef={register} />
          </FormGroup>
          <FormGroup className="mt-3">
            <Label className="font-weight-bold">Title</Label>
            <Input
              className="mb-2"
              placeholder="Title"
              name="title"
              defaultValue={currentTitle}
              onChange={() => setErrorMessage('')}
              innerRef={register}
            />
            {showError('title')}
          </FormGroup>
          <FormGroup>
            <Label className="font-weight-bold">Description</Label>
            <Input
              className="mb-2"
              type="textarea"
              placeholder="Description"
              name="description"
              defaultValue={currentDescription}
              onChange={() => setErrorMessage('')}
              innerRef={register}
            />
            {showError('description')}
          </FormGroup>
          <FormGroup>
            <Label className="font-weight-bold">Status</Label>
            <Input
              className="mb-2"
              type="select"
              placeholder="Status"
              name="status"
              defaultValue={taskStatus.getValue(sourceDroppable)}
              onChange={() => setErrorMessage('')}
              innerRef={register}
            >
              <option value={taskStatus.OPEN}>Open</option>
              <option value={taskStatus.DOING}>Doing</option>
              <option value={taskStatus.CLOSED}>Closed</option>
            </Input>
            {showError('status')}
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="success">Do Something</Button>
          <Button color="danger" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
}

UpdateDialog.propTypes = {
  id: PropTypes.number.isRequired,
  currentTitle: PropTypes.string.isRequired,
  currentDescription: PropTypes.string.isRequired,
  sourceDroppable: PropTypes.string.isRequired,
  modal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default UpdateDialog;
