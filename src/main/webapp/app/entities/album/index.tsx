import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Album from './album';
import AlbumDetail from './album-detail';
import AlbumUpdate from './album-update';
import AlbumDeleteDialog from './album-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AlbumUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AlbumUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AlbumDetail} />
      <ErrorBoundaryRoute path={match.url} component={Album} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AlbumDeleteDialog} />
  </>
);

export default Routes;
