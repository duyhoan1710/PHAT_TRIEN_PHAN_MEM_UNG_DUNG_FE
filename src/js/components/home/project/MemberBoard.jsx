import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { Table } from 'reactstrap';
import {
  CircularProgress, makeStyles, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import dayjs from 'dayjs';

import AddMemberDialog from './AddMemberDialog';
import ConfirmDialog from '../../common/ConfirmDialog';
import { api } from '../../../helpers/axios';

const useStyles = makeStyles((theme) => ({
  flexGrow: {
    display: 'flex',
    flexGrow: 1,
  },
  curser: {
    cursor: 'pointer',
  },
  small: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
}));

const MemberBoard = ({ projectId }) => {
  const history = useHistory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggle = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const classes = useStyles();

  const { data: getListMember, isLoading, error } = useQuery('list members', async () => {
    const res = await api.get(`/projects/${projectId}/members`, {
      params: {
        offset: 0,
        limit: 100,
      },
    });
    return res.data;
  }, {
    staleTime: 180000,
  });

  const Header = (
    <TableHead>
      <TableRow size="small">
        <TableCell size="medium" align="left">
          #
        </TableCell>

        <TableCell size="medium" align="left">
          Full Name
        </TableCell>

        <TableCell size="medium" align="left">
          Email
        </TableCell>

        <TableCell size="medium" align="left">
          Phone
        </TableCell>

        <TableCell size="medium" align="left">
          Address
        </TableCell>

        <TableCell size="medium" align="left">
          Birthday
        </TableCell>

        <TableCell size="medium" align="left">
          Tool
        </TableCell>

      </TableRow>
    </TableHead>
  );

  if (isLoading) {
    return (
      <>
        <TableContainer>
          <Table size="small" aria-label="a dense table">
            {Header}
          </Table>
        </TableContainer>
        <CircularProgress />
      </>
    );
  }

  if (error) {
    history.push('/');
  }

  if (getListMember) {
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <AddMemberDialog projectId={projectId} members={getListMember.members} />
        </div>
        <TableContainer>
          <Table>
            {Header}
            <TableBody>
              {
                getListMember.members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Avatar src={member.avatar} className={classes.small} />
                    </TableCell>

                    <TableCell>
                      {member.full_name}
                    </TableCell>

                    <TableCell>
                      {member.email}
                    </TableCell>

                    <TableCell>
                      {member.phone}
                    </TableCell>

                    <TableCell>
                      {member.address}
                    </TableCell>

                    <TableCell>
                      {member.birthday ? dayjs(member.birthday).format('MM-DD-YYYY') : ''}
                    </TableCell>

                    <TableCell>
                      <Button onClick={toggle}>
                        <DeleteForeverIcon color="primary" style={{ fontSize: 30 }} />
                      </Button>
                      <ConfirmDialog
                        isDialogOpen={isDialogOpen}
                        toggle={toggle}
                        title="Remove Member"
                        content="Are you sure to remove this member from project ?"
                        data={{ projectId, memberId: member.id, queryCache: 'list member' }}
                      />
                    </TableCell>

                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  } return <></>;
};

MemberBoard.propTypes = {
  projectId: PropTypes.string.isRequired,
};

export default MemberBoard;
