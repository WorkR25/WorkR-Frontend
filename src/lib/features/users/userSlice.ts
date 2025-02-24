import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

import { ApiError, CreateAdminData, EmployerRequest, JobseekerRequest, UploadRequest, UserRequest, UserResponse, UserState } from '@/types';
import axiosUserInstance from '@/utils/axiosInstances/axiosUserInstance';


const initialState: UserState = {
  user: null,
  openAdminModal: false,
  resumeLink: ''
};

export const getUser = createAsyncThunk<AxiosResponse<UserResponse>, UserRequest, { rejectValue: ApiError }>('/user/getUser', async (data, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<UserResponse> = await axiosUserInstance.get(`/${data.id}`, {
      headers: {
        'x-access-token': data.token
      }
    });
    toast.success('Welcome User');
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
    return rejectWithValue({ success: false, message: 'Something went wrong!!!' });
  }
});

export const updateJobseeker = createAsyncThunk<AxiosResponse<UserResponse>, JobseekerRequest, { rejectValue: ApiError }>('/user/updatejobseeker', async (data, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<UserResponse> = await axiosUserInstance.put(`/${data.id}/jobseeker`, data, {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.success('Successfully Updated Your Details');
    return response;
  } catch (error) {
    console.log(error);
    const axiosError = error as AxiosError<ApiError>;
    if(axiosError.response?.data) {
      toast.error(axiosError.response.data.message);
      return rejectWithValue({
        error: axiosError.response.data, data: axiosError.status,
        success: false,
        message: axiosError.response.data.message
      });
    }
    return rejectWithValue({ success: false, message: 'Something went wrong!!!' });
  }
});

export const updtaeEmployer = createAsyncThunk<AxiosResponse<UserResponse>, EmployerRequest, { rejectValue: ApiError }>('/user/updateemployer', async (data, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<UserResponse> = await axiosUserInstance.put(`/${data.id}/employer`, data, {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.success('Successfully Updated Your Details');
    return response;
  } catch (error) {
    console.log(error);
    const axiosError = error as AxiosError<ApiError>;
    if(axiosError.response?.data) {
      toast.error(axiosError.response.data.message);
      return rejectWithValue({
        error: axiosError.response.data, data: axiosError.status,
        success: false,
        message: axiosError.response.data.message
      });
    }
    return rejectWithValue({ success: false, message: 'Something went wrong!!!' });
  }
});

export const makeAdmin = createAsyncThunk<AxiosResponse, CreateAdminData, { rejectValue: ApiError }>('/user/createadmin', async (data, { rejectWithValue }) => {
  try {
    const response = axiosUserInstance.patch('/adminrole', data, {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.promise(response, {
      loading: 'Creating...',
      success: 'Successfully made this employer an admin'
    });
    return await response;
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
    return rejectWithValue({ success: false, message: 'Something went wrong!!!' });
  }
});

export const uploadResume = createAsyncThunk<AxiosResponse<UserResponse>, UploadRequest, { rejectValue: ApiError }>('/user/resume', async (data, { rejectWithValue }) => {
  try {
    const response: Promise<AxiosResponse<UserResponse>> = axiosUserInstance.post(`/${data.userId}/upload-resume`, data.file, {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.promise(response, {
      loading: 'Uploading...',
      success: 'Your Resume is Successfully Uploaded'
    });
    return await response;
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
    return rejectWithValue({ success: false, message: 'Something went wrong!!!' });
  }
});

export const uploadProfimeImage = createAsyncThunk<AxiosResponse<UserResponse>, UploadRequest, { rejectValue: ApiError }>('/user/profile-image', async (data, { rejectWithValue }) => {
  try {
    const response: Promise<AxiosResponse<UserResponse>> = axiosUserInstance.post(`/${data.userId}/upload-profile-image`, data.file, {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.promise(response, {
      loading: 'Uploading...',
      success: 'Your Profile Image is Successfully Uploaded'
    });
    return await response;
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
    return rejectWithValue({ success: false, message: 'Something went wrong!!!' });
  }
});

const userSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      if(typeof window !== 'undefined') {
        localStorage.clear();
      }
    },

    setOpenAdminModal: (state, action) => {
      state.openAdminModal = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.user = action.payload.data?.data;
      })
      .addCase(updateJobseeker.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.user = action.payload.data?.data;
      })
      .addCase(updtaeEmployer.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.user = action.payload.data?.data;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.user = action.payload.data?.data;
      })
      .addCase(uploadProfimeImage.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.user = action.payload.data?.data;
      });
  }
});

export const { logout, setOpenAdminModal } = userSlice.actions;
export default userSlice.reducer;