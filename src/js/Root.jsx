/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';

import PrivateRoute from './PrivateRoute';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Error from './pages/Error';
import TasksBoard from './pages/TasksBoard';
import '../scss/app.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

const queryCache = new QueryCache();
const Root = () => (
  <ReactQueryCacheProvider queryCache={queryCache}>
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/error" component={Error} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />

          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/projects/:projectId/tasks" component={TasksBoard} />
        </Switch>
      </div>
    </BrowserRouter>
  </ReactQueryCacheProvider>
);

export default Root;
