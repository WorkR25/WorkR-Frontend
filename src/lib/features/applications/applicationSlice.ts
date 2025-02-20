import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

import { ApiError, AppicationState, ApplicantResponse, ApplicationRequest, ApplicationResponse, GetApplicantRequest } from '@/types';
import axiosApplicationInstance from '@/utils/axiosInstances/axiosApplicationInstance';

const initialState: AppicationState = {
  applications: null,
  openApplyModal: false,
  application: null
};

export const createApplication = createAsyncThunk<AxiosResponse, ApplicationRequest, { rejectValue: ApiError }>('/jobs/apply', async (data, { rejectWithValue }) => {
  try {
    const response = axiosApplicationInstance.post('/apply', data, {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.promise(response, {
      loading: 'Applying...',
      success: 'Successfully Applied for the job'
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

export const getAllApplicants = createAsyncThunk<AxiosResponse<ApplicantResponse>, GetApplicantRequest, { rejectValue: ApiError }>('/apply/get', async (data, { rejectWithValue }) => {
  try {
    const response: Promise<AxiosResponse<ApplicantResponse>> = axiosApplicationInstance.get('/', {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : '' 
      },
      params: {
        userId: data.userId,
        jobId: data.jobId
      }
    });
    toast.promise(response, {
      loading: 'Fetching Applicants...',
      success: 'Successfully Fetched All Applicants'
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

export const getApplication = createAsyncThunk<AxiosResponse<ApplicationResponse>, number, { rejectValue: ApiError }>('/get/application', async (data, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<ApplicationResponse> = await axiosApplicationInstance.get('/application-details', {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      },
      params: {
        applicantId: data
      }
    });
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

const applicationSlice = createSlice({
  name: 'applicationState',
  initialState,
  reducers: {
    setOpenApplyModal: (state, action) => {
      state.openApplyModal = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllApplicants.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.applications = action.payload.data?.data;
      })
      .addCase(getApplication.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.application = action.payload.data?.data;
      });
  }
});

export const { setOpenApplyModal } = applicationSlice.actions;
export default applicationSlice.reducer;