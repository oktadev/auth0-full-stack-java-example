import album from 'app/entities/album/album.reducer';
import photo from 'app/entities/photo/photo.reducer';
import tag from 'app/entities/tag/tag.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  album,
  photo,
  tag,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
