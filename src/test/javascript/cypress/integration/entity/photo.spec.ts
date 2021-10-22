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

describe('Photo e2e test', () => {
  const photoPageUrl = '/photo';
  const photoPageUrlPattern = new RegExp('/photo(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'admin';
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';
  const photoSample = {
    title: 'applications Loan Practical',
    image: 'Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=',
    imageContentType: 'unknown',
  };

  let photo: any;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, username, password);
    });
    cy.intercept('GET', '/api/photos').as('entitiesRequest');
    cy.visit('');
    cy.get(entityItemSelector).should('exist');
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('XSRF-TOKEN', 'JSESSIONID');
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/photos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/photos').as('postEntityRequest');
    cy.intercept('DELETE', '/api/photos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (photo) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/photos/${photo.id}`,
      }).then(() => {
        photo = undefined;
      });
    }
  });

  afterEach(() => {
    cy.oauthLogout();
    cy.clearCache();
  });

  it('Photos menu should load Photos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('photo');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Photo').should('exist');
    cy.url().should('match', photoPageUrlPattern);
  });

  describe('Photo page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(photoPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Photo page', () => {
        cy.get(entityCreateButtonSelector).click({ force: true });
        cy.url().should('match', new RegExp('/photo/new$'));
        cy.getEntityCreateUpdateHeading('Photo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', photoPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/photos',
          body: photoSample,
        }).then(({ body }) => {
          photo = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/photos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [photo],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(photoPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Photo page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('photo');
        cy.get(entityDetailsBackButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', photoPageUrlPattern);
      });

      it('edit button click should load edit Photo page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Photo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click({ force: true });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', photoPageUrlPattern);
      });

      it('last delete button click should delete instance of Photo', () => {
        cy.intercept('GET', '/api/photos/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('photo').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', photoPageUrlPattern);

        photo = undefined;
      });
    });
  });

  describe('new Photo page', () => {
    beforeEach(() => {
      cy.visit(`${photoPageUrl}`);
      cy.get(entityCreateButtonSelector).click({ force: true });
      cy.getEntityCreateUpdateHeading('Photo');
    });

    it('should create an instance of Photo', () => {
      cy.get(`[data-cy="title"]`).type('input').should('have.value', 'input');

      cy.get(`[data-cy="description"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.setFieldImageAsBytesOfEntity('image', 'integration-test.png', 'image/png');

      // since cypress clicks submit too fast before the blob fields are validated
      cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        photo = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', photoPageUrlPattern);
    });
  });
});
