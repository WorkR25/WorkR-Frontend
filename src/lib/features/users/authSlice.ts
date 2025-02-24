import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

import { ApiError, LoginResponse, SigninDetails, SigninResponse, SignupDetails } from '@/types';
import axiosUserInstance from '@/utils/axiosInstances/axiosUserInstance';

const initialState: LoginResponse = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''
};
  

export const signup = createAsyncThunk<AxiosResponse, SignupDetails, { rejectValue: ApiError }>('/auth/signup', async (data, { rejectWithValue }) => {
  try {
    const response = await axiosUserInstance.post('/signup', data);
    toast.success('User Created Successfully, Please Sign in');
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    if(axiosError.response?.data) {
      toast.error(axiosError.response.data.message);
      return rejectWithValue({
        error: axiosError.response.data, data: axiosError.status,
        success: false,
        message: axiosError.response.data.message
      });
    }
    return rejectWithValue({ success: false, message: 'Something went wrong!!!'});
  }
});

export const signin = createAsyncThunk<AxiosResponse<SigninResponse>, SigninDetails, { rejectValue: ApiError }>('/auth/signin', async (data, { rejectWithValue }) => {
  try {
    const response = await axiosUserInstance.post('/signin', data);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    if(axiosError.response?.data) {
      console.log(axiosError.response.data);
      toast.error(axiosError.response.data.message);
      return rejectWithValue(axiosError.response.data);
    }
    return rejectWithValue({ success: false, message: 'Something went wrong!!!'});
  }
});

const authSlice = createSlice({
  name: 'authState',
  initialState,
  reducers: {
    clearToken: (state) => {
      state.token = '';
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signin.fulfilled, (state, action) => {
      if(typeof window !== 'undefined') {
        if(!action.payload) return;

        state.token = action.payload.data?.data;
        localStorage.setItem('token', action.payload.data?.data);
      }
    });
  }
});

export const { clearToken } = authSlice.actions;
export default authSlice.reducer;