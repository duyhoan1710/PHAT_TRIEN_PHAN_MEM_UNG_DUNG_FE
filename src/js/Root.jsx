/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { SnackbarProvider } from 'notistack';
import { ReactQueryDevtools } from 'react-query-devtools';

import PrivateRoute from './PrivateRoute';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Error from './pages/Error';
import TasksBoard from './pages/TasksBoard';
import MemberBoard from './pages/MemberBoard';
import MyRepository from './pages/MyRepository';
import AllRepository from './pages/AllRepository';
import '../scss/app.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

const queryCache = new QueryCache();
const Root = () => (
  <ReactQueryCacheProvider queryCache={queryCache}>
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/error" component={Error} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/sign-up" component={SignUp} />

            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/repository/me" component={MyRepository} />
            <PrivateRoute exact path="/repository/all" component={AllRepository} />

            <PrivateRoute exact path="/projects/:projectId/board" component={TasksBoard} />
            <PrivateRoute exact path="/projects/:projectId/member" component={MemberBoard} />

          </Switch>
        </div>
      </BrowserRouter>
    </SnackbarProvider>
    <ReactQueryDevtools />
  </ReactQueryCacheProvider>
);

export default Root;
