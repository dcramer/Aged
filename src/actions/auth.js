import { Alert } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { Sentry } from 'react-native-sentry';

import { gql } from 'react-apollo';
import api from '../api';

import {
  ACCESS_TOKEN_FAILURE,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
} from '../reducers/auth';

import firebase, { db } from '../firebase';

const GQL_LOGIN = gql`
  mutation LoginMutation($facebookToken: String!) {
    login(facebookToken: $facebookToken) {
      user {
        id
        email
        name
      }
    }
  }
`;

export const loginFacebook = () => {
  return dispatch => {
    dispatch(login());
    LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']).then(
      result => {
        if (result.isCancelled) {
          Alert.alert('Whoops!', 'You cancelled the sign in.');
        } else {
          dispatch(fetchAccessToken(true));
        }
      },
      error => {
        dispatch(loginFailure(error.message));
      }
    );
  };
};

export function fetchAccessToken(update = false) {
  return dispatch => {
    AccessToken.getCurrentAccessToken()
      .then(data => {
        api
          .mutate({
            mutation: GQL_LOGIN,
            variables: { facebookToken: data.accessToken },
          })
          .then(resp => {
            dispatch(updateUser(resp.data.user));
            console.warn(resp.data);
          })
          .catch(error => {
            dispatch(loginFailure(error.message));
          });
        // api.resetStore();
        // const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
        // firebase
        //   .auth()
        //   .signInAndRetrieveDataWithCredential(credential)
        //   .then(({ user }) => {
        //     if (updateUser) {
        //       dispatch(updateUser(user));
        //     }
        //     dispatch(loginSuccess(user));
        //   })
        //   .catch(error => {
        //     dispatch(loginFailure(error.message));
        //   });
      })
      .catch(error => {
        dispatch(accessTokenFailure(error.message));
      });
  };
}

export function login() {
  return {
    type: LOGIN,
  };
}

export function logOut() {
  return dispatch => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        api.resetStore();
      });

    dispatch({
      type: LOGOUT,
    });
  };
}

export function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    user,
  };
}

export function loginFailure(error) {
  Sentry.captureException(error);
  Alert.alert('Sign in error', error);

  return {
    type: LOGIN_FAILURE,
    error,
  };
}

export function accessTokenFailure(error) {
  return {
    type: ACCESS_TOKEN_FAILURE,
    error,
  };
}

export function updateUser(user) {
  return dispatch => {
    let userRef = db.collection('users').doc(user.uid);
    db.runTransaction(async transaction => {
      let userDoc = await transaction.get(userRef);
      if (userDoc.exists) {
        await transaction.update(userRef, {
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        await transaction.set(userRef, {
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      }
      dispatch(updateUserSuccess(user));
    }).catch(error => {
      dispatch(updateUserFailure(user, error));
    });
  };
}
export function updateUserSuccess(user) {
  return {
    type: UPDATE_USER_SUCCESS,
    user,
  };
}

export function updateUserFailure(user, error) {
  Sentry.captureException(error);

  return {
    type: UPDATE_USER_FAILURE,
    user,
    error,
  };
}
