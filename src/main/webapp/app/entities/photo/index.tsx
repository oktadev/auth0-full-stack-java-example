import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Photo from './photo';
import PhotoDetail from './photo-detail';
import PhotoUpdate from './photo-update';
import PhotoDeleteDialog from './photo-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={PhotoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={PhotoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={PhotoDetail} />
      <ErrorBoundaryRoute path={match.url} component={Photo} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={PhotoDeleteDialog} />
  </>
);

export default Routes;
