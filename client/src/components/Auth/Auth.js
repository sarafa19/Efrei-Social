import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Input from './Input';
import { signin, signup, googleSignIn } from '../../actions/auth';
import useStyles from './styles';

const Auth = () => {
  const classes = useStyles();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
  });
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      dispatch(signup(formData, history)); // Passer history au lieu de navigate
    } else {
      dispatch(signin(formData, history)); // Passer history au lieu de navigate
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  };

  const googleSuccess = useCallback(async (credentialResponse) => {
    try {
      await dispatch(googleSignIn(credentialResponse.credential, history));
    } catch (error) {
      console.error('Google auth error:', error);
    }
  }, [dispatch, history]); // Ajout des dépendances

  return (
    <GoogleOAuthProvider clientId="890550716111-1089qbvj5iudsdid0pojng4qskmlbqlu.apps.googleusercontent.com">
      <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {isSignup && (
                <>
                  <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                  <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                </>
              )}
              <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
              <Input name="password" label="Password" handleChange={handleChange} type="password" />
              {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
            </Grid>
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              {isSignup ? 'Sign Up' : 'Sign In'}
            </Button>
            <GoogleLogin
              onSuccess={googleSuccess}
              onError={() => console.log('Google Login Failed')}
              useOneTap
              auto_select
            />
            <Grid container justify="flex-end">  // 'justify' pour Material-UI v4
              <Grid item>
                <Button onClick={switchMode}>
                  {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default Auth;
