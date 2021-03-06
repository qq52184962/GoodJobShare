import authStatus from '../constants/authStatus';

export const SET_LOGIN = '@@auth/SET_LOGIN';
export const SET_USER = '@@auth/SET_USER';
export const LOG_OUT = '@@auth/LOG_OUT';

const setLogin = (status, token = null) => ({
  type: SET_LOGIN,
  status,
  token,
});

const setUser = user => ({
  type: SET_USER,
  user,
});

const logOutAction = () => ({
  type: LOG_OUT,
});

export const logout = () => (dispatch, getState, { history }) => {
  dispatch(logOutAction());
  history.push('/');
};

export const loginWithFB = FB => (dispatch, getState, { api }) => {
  if (FB) {
    return new Promise(resolve =>
      FB.login(response => resolve(response), { scope: 'email' }),
    ).then(response => {
      if (response.status === authStatus.CONNECTED) {
        return api.auth
          .postAuthFacebook({
            accessToken: response.authResponse.accessToken,
          })
          .then(({ token, user: { _id, facebook_id } }) =>
            dispatch(loginWithToken(token)),
          )
          .then(() => authStatus.CONNECTED);
      } else if (response.status === authStatus.NOT_AUTHORIZED) {
        dispatch(setLogin(authStatus.NOT_AUTHORIZED));
      }
      return response.status;
    });
  }
  return Promise.reject('FB should ready');
};

const getMeInfo = token => (dispatch, getState, { api }) =>
  api.me.getMe({ token }).catch(error => {
    dispatch(logOutAction());
    throw error;
  });

/**
 * Flow
 *
 * loginWithFB   ---\                      |
 *          (token) +--> loginWithToken  --|
 * loginWithXXX  ---/                      | Auth State
 *                                         |   Update
 *                               logout  --|
 *                                         |
 */
export const loginWithToken = token => (dispatch, getState, { api }) => {
  dispatch(getMeInfo(token))
    .then(user => {
      dispatch(setUser(user));
      dispatch(setLogin(authStatus.CONNECTED, token));
    })
    .catch(error => {
      console.error(error);
      dispatch(setLogin(authStatus.NOT_AUTHORIZED));
    });
};
