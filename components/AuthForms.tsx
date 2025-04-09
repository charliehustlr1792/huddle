'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { handleSignup, handleLogin } from '@/lib/auth';
import { z } from 'zod';
import { signupSchema, loginSchema } from '@/types/auth';
import { useAppDispatch} from '@/hooks';
import { setLoggedIn } from '@/stores/UserStore';
import { setUser } from '@/stores/AuthStore';

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 320px;
  gap: 20px;
`;

export const SignUpForm = () => {
  const dispatch=useAppDispatch()
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (prop: keyof z.infer<typeof signupSchema>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({ ...values, [prop]: e.target.value });
    if (errors[prop]) {
      setErrors({ ...errors, [prop]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setErrors({});
    
    try {
      setIsSubmitting(true);
      const response = await handleSignup(values);
      const user={name:values.name,email:values.email}
      if (response.errors) {
        const fieldErrors: Record<string, string> = {};
        response.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (response.error) {
        setFormError(response.error.toString());
      } else if (response.success) {
        dispatch(setLoggedIn(true));
        dispatch(setUser(user))
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred during signup');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <TextField
        label="Team Name"
        variant="outlined"
        color="secondary"
        autoFocus
        value={values.name}
        error={!!errors.name}
        helperText={errors.name || ''}
        onChange={handleChange('name')}
      />

      <TextField
        label="Email"
        variant="outlined"
        color="secondary"
        type="email"
        value={values.email}
        error={!!errors.email}
        helperText={errors.email || ''}
        onChange={handleChange('email')}
      />

      <TextField
        type="password"
        label="Password"
        value={values.password}
        onChange={handleChange('password')}
        color="secondary"
        error={!!errors.password}
        helperText={errors.password || ''}
      />
      
      {formError && <Alert severity="error">{formError}</Alert>}
      
      <Button 
        variant="contained" 
        color="secondary" 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </FormWrapper>
  );
};

export const SignInForm = () => {
  const dispatch=useAppDispatch();
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (prop: keyof z.infer<typeof loginSchema>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({ ...values, [prop]: e.target.value });
    if (errors[prop]) {
      setErrors({ ...errors, [prop]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setErrors({});
    
    try {
      setIsSubmitting(true);
      const response = await handleLogin(values);
      
      if (response.errors) {
        const fieldErrors: Record<string, string> = {};
        response.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (response.error) {
        setFormError(response.error.toString());
      } else {
        dispatch(setLoggedIn(true));
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An error occurred during signin');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <TextField
        label="Email"
        variant="outlined"
        color="secondary"
        type="email"
        autoFocus
        value={values.email}
        error={!!errors.email}
        helperText={errors.email || ''}
        onChange={handleChange('email')}
      />

      <TextField
        type='password'
        label="Password"
        value={values.password}
        onChange={handleChange('password')}
        color="secondary"
        error={!!errors.password}
        helperText={errors.password || ''}
      />
      
      {formError && <Alert severity="error">{formError}</Alert>}
      
      <Button 
        variant="contained" 
        color="secondary" 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </Button>
    </FormWrapper>
  );
};