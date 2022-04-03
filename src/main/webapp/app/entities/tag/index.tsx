import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Tag from './tag';
import TagDetail from './tag-detail';
import TagUpdate from './tag-update';
import TagDeleteDialog from './tag-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TagUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TagUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TagDetail} />
      <ErrorBoundaryRoute path={match.url} component={Tag} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TagDeleteDialog} />
  </>
);

export default Routes;
