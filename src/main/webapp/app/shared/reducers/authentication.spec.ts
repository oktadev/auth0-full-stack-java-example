import thunk from 'redux-thunk';
import axios from 'axios';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import authentication, {
  getSession,
  getAccount,
  logoutServer,
  clearAuthentication,
  logout,
  authError,
  clearAuth,
  initialState,
} from 'app/shared/reducers/authentication';
import { updateLocale } from 'app/shared/reducers/locale';

describe('Authentication reducer tests', () => {
  function isAccountEmpty(state): boolean {
    return Object.keys(state.account).length === 0;
  }

  describe('Common tests', () => {
    it('should return the initial state', () => {
      const toTest = authentication(undefined, { type: '' });
      expect(toTest).toMatchObject({
        loading: false,
        isAuthenticated: false,
        errorMessage: null, // Errors returned from server side
        redirectMessage: null,
      });
      expect(isAccountEmpty(toTest));
    });
  });

  describe('Success', () => {
    it('should detect a success on get session and be authenticated', () => {
      const payload = { data: { activated: true } };
      const toTest = authentication(undefined, { type: getAccount.fulfilled.type, payload });
      expect(toTest).toMatchObject({
        isAuthenticated: true,
        loading: false,
        account: payload.data,
      });
    });

    it('should detect a success on get session and not be authenticated', () => {
      const payload = { data: { activated: false } };
      const toTest = authentication(undefined, { type: getAccount.fulfilled.type, payload });
      expect(toTest).toMatchObject({
        isAuthenticated: false,
        loading: false,
        account: payload.data,
      });
    });
  });

  describe('Failure', () => {
    it('should detect a failure', () => {
      const error = { message: 'Something happened.' };
      const toTest = authentication(undefined, { type: getAccount.rejected.type, error });

      expect(toTest).toMatchObject({
        loading: false,
        isAuthenticated: false,
        errorMessage: error.message,
      });
      expect(isAccountEmpty(toTest));
    });
  });

  describe('Other cases', () => {
    it('should properly reset the current state when a logout is requested', () => {
      const payload = { data: { logoutUrl: 'http://localhost:8080/logout' } };
      const toTest = authentication(undefined, { type: logoutServer.fulfilled.type, payload });
      expect(toTest).toMatchObject({
        loading: false,
        isAuthenticated: false,
        errorMessage: null,
        redirectMessage: null,
      });
      expect(isAccountEmpty(toTest));
    });

    it('should properly define an error message and change the current state to display the login modal', () => {
      const message = 'redirect me please';
      const toTest = authentication(undefined, authError(message));
      expect(toTest).toMatchObject({
        loading: false,
        isAuthenticated: false,
        errorMessage: null,
        redirectMessage: message,
      });
      expect(isAccountEmpty(toTest));
    });

    it('should clear authentication', () => {
      const toTest = authentication({ ...initialState, isAuthenticated: true }, clearAuth());
      expect(toTest).toMatchObject({
        loading: false,
        isAuthenticated: false,
      });
    });
  });

  describe('Actions', () => {
    let store;

    const resolvedObject = { value: 'whatever' };
    beforeEach(() => {
      const mockStore = configureStore([thunk]);
      store = mockStore({ authentication: { account: { langKey: 'en' } } });
      axios.get = sinon.stub().returns(Promise.resolve(resolvedObject));
    });

    it('dispatches GET_SESSION_PENDING and GET_SESSION_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: getAccount.pending.type,
        },
        {
          type: getAccount.fulfilled.type,
          payload: resolvedObject,
        },
        updateLocale('en'),
      ];
      await store.dispatch(getSession());
      expect(store.getActions()[0]).toMatchObject(expectedActions[0]);
      expect(store.getActions()[1]).toMatchObject(expectedActions[1]);
      expect(store.getActions()[2]).toMatchObject(expectedActions[2]);
    });

    it('dispatches LOGOUT actions', async () => {
      axios.post = sinon.stub().returns(Promise.resolve({}));
      const expectedActions = [
        {
          type: logoutServer.pending.type,
        },
        {
          type: logoutServer.fulfilled.type,
          payload: {},
        },
        {
          type: getAccount.pending.type,
        },
      ];
      await store.dispatch(logout());
      expect(store.getActions()[0]).toMatchObject(expectedActions[0]);
      expect(store.getActions()[1]).toMatchObject(expectedActions[1]);
      expect(store.getActions()[2]).toMatchObject(expectedActions[2]);
    });

    it('dispatches CLEAR_AUTH actions', async () => {
      const expectedActions = [authError('message'), clearAuth()];
      await store.dispatch(clearAuthentication('message'));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
