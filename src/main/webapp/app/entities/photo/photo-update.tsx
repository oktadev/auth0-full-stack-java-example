import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, translate, ValidatedBlobField, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getEntities as getAlbums } from 'app/entities/album/album.reducer';
import { getEntities as getTags } from 'app/entities/tag/tag.reducer';
import { createEntity, getEntity, updateEntity } from './photo.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const PhotoUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const albums = useAppSelector(state => state.album.entities);
  const tags = useAppSelector(state => state.tag.entities);
  const photoEntity = useAppSelector(state => state.photo.entity);
  const loading = useAppSelector(state => state.photo.loading);
  const updating = useAppSelector(state => state.photo.updating);
  const updateSuccess = useAppSelector(state => state.photo.updateSuccess);
  const handleClose = () => {
    props.history.push('/photo');
  };

  useEffect(() => {
    if (!isNew) {
      dispatch(getEntity(props.match.params.id));
    }

    dispatch(getAlbums({}));
    dispatch(getTags({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    values.taken = convertDateTimeToServer(values.taken);
    values.uploaded = convertDateTimeToServer(values.uploaded);

    const entity = {
      ...photoEntity,
      ...values,
      tags: mapIdList(values.tags),
      album: albums.find(it => it.id.toString() === values.album.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          taken: displayDefaultDateTime(),
          uploaded: displayDefaultDateTime(),
        }
      : {
          ...photoEntity,
          taken: convertDateTimeFromServer(photoEntity.taken),
          uploaded: convertDateTimeFromServer(photoEntity.uploaded),
          album: photoEntity?.album?.id,
          tags: photoEntity?.tags?.map(e => e.id.toString()),
        };

  const metadata = (
    <div>
      <ValidatedField label={translate('flickr2App.photo.height')} id="photo-height" name="height" data-cy="height" type="text" />
      <ValidatedField label={translate('flickr2App.photo.width')} id="photo-width" name="width" data-cy="width" type="text" />
      <ValidatedField
        label={translate('flickr2App.photo.taken')}
        id="photo-taken"
        name="taken"
        data-cy="taken"
        type="datetime-local"
        placeholder="YYYY-MM-DD HH:mm"
      />
      <ValidatedField
        label={translate('flickr2App.photo.uploaded')}
        id="photo-uploaded"
        name="uploaded"
        data-cy="uploaded"
        type="datetime-local"
        placeholder="YYYY-MM-DD HH:mm"
      />
    </div>
  );
  const metadataRows = isNew ? '' : metadata;

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="flickr2App.photo.home.createOrEditLabel" data-cy="PhotoCreateUpdateHeading">
            <Translate contentKey="flickr2App.photo.home.createOrEditLabel">Create or edit a Photo</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="photo-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('flickr2App.photo.title')}
                id="photo-title"
                name="title"
                data-cy="title"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('flickr2App.photo.description')}
                id="photo-description"
                name="description"
                data-cy="description"
                type="textarea"
              />
              <ValidatedBlobField
                label={translate('flickr2App.photo.image')}
                id="photo-image"
                name="image"
                data-cy="image"
                isImage
                accept="image/*"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              {metadataRows}
              <ValidatedField id="photo-album" name="albumId" data-cy="album" label={translate('flickr2App.photo.album')} type="select">
                <option value="" key="0" />
                {albums
                  ? albums.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.title}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField label={translate('flickr2App.photo.tag')} id="photo-tag" data-cy="tag" type="select" multiple name="tags">
                <option value="" key="0" />
                {tags
                  ? tags.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.name}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/photo" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PhotoUpdate;
