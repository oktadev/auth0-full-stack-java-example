import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntity } from './photo.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const PhotoDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const photoEntity = useAppSelector(state => state.photo.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="photoDetailsHeading">
          <Translate contentKey="flickr2App.photo.detail.title">Photo</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{photoEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="flickr2App.photo.title">Title</Translate>
            </span>
          </dt>
          <dd>{photoEntity.title}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="flickr2App.photo.description">Description</Translate>
            </span>
          </dt>
          <dd>{photoEntity.description}</dd>
          <dt>
            <span id="image">
              <Translate contentKey="flickr2App.photo.image">Image</Translate>
            </span>
          </dt>
          <dd>
            {photoEntity.image ? (
              <div>
                {photoEntity.imageContentType ? (
                  <a onClick={openFile(photoEntity.imageContentType, photoEntity.image)}>
                    <img src={`data:${photoEntity.imageContentType};base64,${photoEntity.image}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {photoEntity.imageContentType}, {byteSize(photoEntity.image)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="height">
              <Translate contentKey="flickr2App.photo.height">Height</Translate>
            </span>
          </dt>
          <dd>{photoEntity.height}</dd>
          <dt>
            <span id="width">
              <Translate contentKey="flickr2App.photo.width">Width</Translate>
            </span>
          </dt>
          <dd>{photoEntity.width}</dd>
          <dt>
            <span id="taken">
              <Translate contentKey="flickr2App.photo.taken">Taken</Translate>
            </span>
          </dt>
          <dd>{photoEntity.taken ? <TextFormat value={photoEntity.taken} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="uploaded">
              <Translate contentKey="flickr2App.photo.uploaded">Uploaded</Translate>
            </span>
          </dt>
          <dd>{photoEntity.uploaded ? <TextFormat value={photoEntity.uploaded} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="flickr2App.photo.album">Album</Translate>
          </dt>
          <dd>{photoEntity.album ? photoEntity.album.title : ''}</dd>
          <dt>
            <Translate contentKey="flickr2App.photo.tag">Tag</Translate>
          </dt>
          <dd>
            {photoEntity.tags
              ? photoEntity.tags.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.name}</a>
                    {photoEntity.tags && i === photoEntity.tags.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/photo" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/photo/${photoEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PhotoDetail;
