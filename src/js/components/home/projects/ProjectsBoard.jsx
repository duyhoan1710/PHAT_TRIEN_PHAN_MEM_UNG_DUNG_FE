import React, { useState } from 'react';
import { usePaginatedQuery } from 'react-query';
import { Table } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  CircularProgress, Grid, makeStyles, TableBody, TableCell,
  TableContainer, TableHead, TablePagination, TableRow, TableSortLabel,
} from '@material-ui/core';

import { api } from '../../../helpers/axios';
import CreateDialog from './CreateDialog';
import Propover from '../../common/Popover';

const useStyles = makeStyles(() => ({
  flexGrow: {
    display: 'flex',
    flexGrow: 1,
  },
  curser: {
    cursor: 'pointer',
  },
}));

const ProjectBoard = () => {
  const history = useHistory();

  const onClick = (projectId) => {
    history.push(`/projects/${projectId}/board`);
  };

  const classes = useStyles();

  const LIMIT = 6;

  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortType, setSortType] = useState('desc');

  const getListProject = async () => {
    const res = await api.get('/projects', {
      params: {
        sortBy,
        sortType,
        offset: page * LIMIT,
        limit: LIMIT,
      },
    });
    return res.data;
  };

  const { data, isLoading } = usePaginatedQuery(['projects', {
    page, sortBy, sortType,
  }], getListProject);

  const onChangeSort = (column) => {
    setSortBy(column);
    return sortType === 'desc' ? setSortType('asc') : setSortType('desc');
  };

  const Header = (
    <TableHead>
      <TableRow size="small">
        <TableCell size="medium" align="left">
          {/* <TableSortLabel
            action={sortBy === 'id'}
            direction={sortType}
            onClick={() => onChangeSort('id')}
          >
            Id
          </TableSortLabel> */}
          id
        </TableCell>

        <TableCell size="medium" align="left">
          {/* <TableSortLabel
            action={sortBy === 'name'}
            direction={sortType}
            onClick={() => onChangeSort('name')}
          >
            Name
          </TableSortLabel> */}
          name
        </TableCell>

        <TableCell size="medium" align="left">
          Description
        </TableCell>

        <TableCell size="medium" align="left">
          {/* <TableSortLabel
            action={sortBy === 'created_by'}
            direction={sortType}
            onClick={() => onChangeSort('created_by')}
          >
            Created By
          </TableSortLabel> */}
          created_by
        </TableCell>

        <TableCell size="medium" align="left">
          {/* <TableSortLabel
            action={sortBy === 'created_at'}
            direction={sortType}
            onClick={() => onChangeSort('created_at')}
          >
            Created At
          </TableSortLabel> */}
          created_at
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

  if (data) {
    return (
      <>
        <Grid className="mt-3 mb-3" container direction="row">
          <h3>Project</h3>
          <div className={classes.flexGrow} />
          <CreateDialog />
        </Grid>

        <TableContainer>
          <Table>
            {Header}
            <TableBody>
              {
                data.projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.id}</TableCell>

                    <TableCell onClick={() => onClick(project.id)} className="text-primary">
                      <div className={classes.curser}>{project.name}</div>
                    </TableCell>

                    <TableCell>
                      <Propover text={project.description} />
                    </TableCell>

                    <TableCell>{project.full_name}</TableCell>

                    <TableCell>{dayjs(project.created_at).format('DD/MM/YYYY hh:mm')}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            count={data.total}
            rowsPerPage={LIMIT}
            component="div"
            rowsPerPageOptions={[]}
            onChangePage={(e, newPage) => setPage(newPage)}
          />
        </TableContainer>
      </>
    );
  } return <></>;
};

export default ProjectBoard;
