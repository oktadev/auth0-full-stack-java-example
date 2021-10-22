import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Album e2e test', () => {
  const albumPageUrl = '/album';
  const albumPageUrlPattern = new RegExp('/album(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const albumSample = { title: 'Awesome' };

  let album: any;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, username, password);
    });
    cy.intercept('GET', '/api/albums').as('entitiesRequest');
    cy.visit('');
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/albums+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/albums').as('postEntityRequest');
    cy.intercept('DELETE', '/api/albums/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (album) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/albums/${album.id}`,
      }).then(() => {
        album = undefined;
      });
    }
  });

  afterEach(() => {
    cy.oauthLogout();
    cy.clearCache();
  });

  it('Albums menu should load Albums page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('album');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Album').should('exist');
    cy.url().should('match', albumPageUrlPattern);
  });

  describe('Album page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(albumPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Album page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/album/new$'));
        cy.getEntityCreateUpdateHeading('Album');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', albumPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/albums',
          body: albumSample,
        }).then(({ body }) => {
          album = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/albums+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [album],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(albumPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Album page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('album');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', albumPageUrlPattern);
      });

      it('edit button click should load edit Album page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Album');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', albumPageUrlPattern);
      });

      it('last delete button click should delete instance of Album', () => {
        cy.intercept('GET', '/api/albums/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('album').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', albumPageUrlPattern);

        album = undefined;
      });
    });
  });

  describe('new Album page', () => {
    beforeEach(() => {
      cy.visit(`${albumPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Album');
    });

    it('should create an instance of Album', () => {
      cy.get(`[data-cy="title"]`).type('Soft').should('have.value', 'Soft');

      cy.get(`[data-cy="description"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="created"]`).type('2021-10-22T04:09').should('have.value', '2021-10-22T04:09');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        album = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', albumPageUrlPattern);
    });
  });
});
