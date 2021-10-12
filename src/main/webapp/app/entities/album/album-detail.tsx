import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntity } from './album.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const AlbumDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const albumEntity = useAppSelector(state => state.album.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="albumDetailsHeading">
          <Translate contentKey="flickr2App.album.detail.title">Album</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{albumEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="flickr2App.album.title">Title</Translate>
            </span>
          </dt>
          <dd>{albumEntity.title}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="flickr2App.album.description">Description</Translate>
            </span>
          </dt>
          <dd>{albumEntity.description}</dd>
          <dt>
            <span id="created">
              <Translate contentKey="flickr2App.album.created">Created</Translate>
            </span>
          </dt>
          <dd>{albumEntity.created ? <TextFormat value={albumEntity.created} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="flickr2App.album.user">User</Translate>
          </dt>
          <dd>{albumEntity.user ? albumEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/album" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/album/${albumEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default AlbumDetail;
