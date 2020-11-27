import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { BiUpArrowAlt } from 'react-icons/bi';
import UpdateDialog from './UpdateDialog';
import taskPriority from '../../../enums/taskPriority';

function Task({
  task: {
    id, name, description, priority, full_name: fullName,
  }, index, droppableId,
}) {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <Draggable draggableId={JSON.stringify({ id, name, description })} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Row className="justify-content-center pt-2" onClick={toggle}>
            <Col className="col-10 border rounded justify-content-center bg-white">
              <p className="text-weight-bold">{name}</p>
              <p className="text-weight-bold"><BiUpArrowAlt color="red" size="30" /></p>
              <p className="text-weight-bold">createBy: {fullName}</p>
            </Col>
          </Row>
          <UpdateDialog
            modal={modal}
            toggle={toggle}
            sourceDroppable={droppableId}
            id={id}
            currentname={name}
            currentDescription={description}
          />
        </div>
      )}
    </Draggable>
  );
}

Task.propTypes = {
  index: PropTypes.number.isRequired,
  droppableId: PropTypes.string.isRequired,
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    priority: PropTypes.number.isRequired,
    full_name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Task;
