import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    data-cy="entity"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  >
    <>{/* to avoid warnings when empty */}</>
    <MenuItem icon="asterisk" to="/album">
      <Translate contentKey="global.menu.entities.album" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/photo">
      <Translate contentKey="global.menu.entities.photo" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tag">
      <Translate contentKey="global.menu.entities.tag" />
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
