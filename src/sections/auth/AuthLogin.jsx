import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Button, Checkbox, FormControlLabel, FormHelperText, InputAdornment,
  InputLabel, OutlinedInput, Stack, Typography, Box
} from '@mui/material';

import * as Yup from 'yup';
import { Formik } from 'formik';

import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { setAlert } from '../../data/slices/alertSlice';
import { login } from '../../data/slices/authSlice';

import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function AuthLogin({ isDemo = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitError, setSubmitError] = React.useState('');

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Formik
      initialValues={{ email: '', password: '', submit: null }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').required('Email is required'),
        password: Yup.string()
          .required('Password is required')
          .test(
            'no-leading-trailing-whitespace',
            'Password cannot start or end with spaces',
            (value) => value && value.trim() === value
          )
      })}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitError('');
        try {
          const resultAction = await dispatch(login(values));
          if (resultAction.type === 'auth/login/fulfilled') {
            dispatch(setAlert({ message: 'Login successful!', severity: 'success' }));
            window.location.replace(
              resultAction.payload.user.role === 'administrator' ? '/' : '/agents'
            );
          } else {
            dispatch(setAlert({ message: 'Invalid email or password', severity: 'error' }));
          }
        } catch (err) {
          console.error(err);
          setSubmitError('Something went wrong');
        }
        setSubmitting(false);
      }}
    >
      {({ errors, handleBlur, handleChange, touched, values, handleSubmit, isSubmitting }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Box sx={{ maxWidth: '100%', width: '100%' }}>
            <Stack spacing={3}>
              {/* Email Field */}
              <div>
                <InputLabel htmlFor="email-login">Email Address</InputLabel>
                <OutlinedInput
                  id="email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
                {touched.email && errors.email && (
                  <FormHelperText error>{errors.email}</FormHelperText>
                )}
              </div>

              {/* Password Field */}
              <div>
                <InputLabel htmlFor="password-login">Password</InputLabel>
                <OutlinedInput
                  id="password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter password"
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {touched.password && errors.password && (
                  <FormHelperText error>{errors.password}</FormHelperText>
                )}
              </div>

              {/* Keep Me Signed In */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    name="keepSignedIn"
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="h6">Keep me signed in</Typography>}
              />

              {/* Submit Error */}
              {submitError && <FormHelperText error>{submitError}</FormHelperText>}

              {/* Submit Button */}
              <AnimateButton>
                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: '#FA003F',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#FA003F' }
                  }}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </AnimateButton>
            </Stack>
          </Box>
        </form>
      )}
    </Formik>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
