import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import * as yup from 'yup';
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import appUser from 'testData/user.json';
import { CustomInput } from 'shared/components';
import { loggedIn } from 'slices/currentUser';

import {
  StyledSignInFormBorder, StyledSignInFormContainer,
  StyledTextHolder, StyledText, StyledButtonHolder,
} from './signInForm.styles';

const signInSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Password is required'),
  password: yup.string().required('Password is required'),
}).required();

const SignInForm = () => {
  const methods = useForm({
    resolver: yupResolver(signInSchema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = ({ email, password }) => {
    if (appUser.email === email && appUser.password === password) {
      dispatch(loggedIn());
      navigate('/my-products');
    } else {
      toast.error('Incorrect username or password. Please try again!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  return(
    <FormProvider {...methods} >
      <StyledSignInFormBorder>
        <StyledSignInFormContainer>
          <Form onSubmit={methods.handleSubmit(onSubmitHandler)}>
            <CustomInput labelName="Email" name="email" />
            <CustomInput labelName="Password" name="password" />
            <StyledTextHolder>
              <StyledText>Don't have an account?</StyledText><Link to="/register">Sign Up</Link>
            </StyledTextHolder>
            <StyledButtonHolder>
              <Button color='blue' type='submit'>Sign In</Button>
            </StyledButtonHolder>
          </Form>
        </StyledSignInFormContainer>
      </StyledSignInFormBorder>
    </FormProvider>
  );
}

export default SignInForm;