import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });

    history.push('/');
  } catch (error) {
    console.log(error);
  }
};

export const signup = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });

    history.push('/');
  } catch (error) {
    console.log(error);
  }
};

export const googleSignIn = (token, history) => async (dispatch) => {
  try {
    const { data } = await api.googleSignIn({ credential: token });

    dispatch({ type: AUTH, data });
    history.push('/');
  } catch (error) {
    console.log(error);
  }
};
