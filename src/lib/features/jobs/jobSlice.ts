import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

import { ApiError, ApproveJobRequest, EmployerResponse, JobEditRequest, JobRequest, JobRequestByFilter, JobResponse, JobState, SingleJobRespone } from '@/types';
import axiosJobInstance from '@/utils/axiosInstances/axiosJobInstance';
import axiosUserInstance from '@/utils/axiosInstances/axiosUserInstance';
import { JOB_CATEGORY } from '@/utils/enums/JobCategory';

const initialState: JobState = {
  openJobForm: false,
  editJobForm: false,
  selectPost: false,
  fulltimeJobs: null,
  internships: null,
  employerJobs: null,
  employerInternships: null,
  pendingJobs: null,
  jobCategory: JOB_CATEGORY.FULLTIME,
  job: null,
  employer: null,
  officeType: '',
  experience: '',
  minSalary: '',
  title: '',
  internshipType: '',
  minStipend: '',
  openPostTab: false,
  editJobDetails: null,
  jobDrawerCategory: 'jobs',
  openFilter: false,
  defaultSalary: 0,
  defaultStipend: 0,
  jobIdForApply: '',
  externalApplyLink: ''
};

export const createJob = createAsyncThunk<AxiosResponse, JobRequest, { rejectValue: ApiError }>('/job/create', async (data, { rejectWithValue }) => {
  try {
    const response = await axiosJobInstance.post('/', data, {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.success('Job Created Successfully');
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

export const updateJob = createAsyncThunk<AxiosResponse, JobEditRequest, { rejectValue: ApiError }>('/job/update', async (data, { rejectWithValue }) => {
  try {
    const response = axiosJobInstance.put(`/${data.id}/update`, data, {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.promise(response, {
      loading: 'Updating...',
      success: 'Updated Successfully, Refresh to see changes'
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

export const getAllFulltimeJobs = createAsyncThunk<AxiosResponse<JobResponse>, void , { rejectValue: ApiError }>('/job/getfulltimejobs', async (_, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<JobResponse> = await axiosJobInstance.get('/fulltime', {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.success('Successfully fetched all Fulltime jobs');
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

export const getAllFulltimeJobsByEmployerId = createAsyncThunk<AxiosResponse<JobResponse>, number , { rejectValue: ApiError }>('/job/getfulltimejobsemployer', async (data, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<JobResponse> = await axiosJobInstance.get(`/${data}/fulltime`, {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.success('Successfully fetched all of your Fulltime jobs');
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

export const getAllInternships = createAsyncThunk<AxiosResponse<JobResponse>, void , { rejectValue: ApiError }>('/job/getinternships', async (_, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<JobResponse> = await axiosJobInstance.get('/internship', {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.success('Successfully fetched all Internships');
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

export const getAllInternshipsByEmployerId = createAsyncThunk<AxiosResponse<JobResponse>, number , { rejectValue: ApiError }>('/job/getinternshipsemployer', async (data, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<JobResponse> = await axiosJobInstance.get(`/${data}/internship`, {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.success('Successfully fetched all of your Internships');
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

export const getJobWithId = createAsyncThunk<AxiosResponse<SingleJobRespone>, string, { rejectValue: ApiError }>('/job/getfulltime', async (data, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<SingleJobRespone> = await axiosJobInstance.get(`/${data}`, {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.success('Successfully fetched the job');
    console.log(response);
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

export const getEmployerWithId = createAsyncThunk<AxiosResponse<EmployerResponse>, number, { rejectValue: ApiError }>('/job/employer', async (data, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<EmployerResponse> = await axiosUserInstance.get(`/${data}`, {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
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

export const getAllFulltimeJobsByFilter = createAsyncThunk<AxiosResponse<JobResponse>, JobRequestByFilter, { rejectValue: ApiError }>('/job/getfulltimebyfilter', async (data, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<JobResponse> = await axiosJobInstance.get('/fulltime/filters', {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      },
      params: {
        ...data
      }
    });
    toast.success('Successfully fetched all Fulltime jobs');
    console.log(response);
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

export const getAllInternshipsByFilter = createAsyncThunk<AxiosResponse<JobResponse>, JobRequestByFilter, { rejectValue: ApiError }>('/job/getinternshipbyfilter', async (data, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<JobResponse> = await axiosJobInstance.get('/internship/filters', {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      },
      params: {
        ...data
      }
    });
    toast.success('Successfully fetched all Internships');
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

export const getAllPendingJobs = createAsyncThunk<AxiosResponse<JobResponse>, number, { rejectValue: ApiError }>('/job/pending', async (data, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<JobResponse> = await axiosJobInstance.get('/pendingjobs', {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      },
      params: {
        userId: data
      }
    });
    toast.success('Successfully fetched all pending jobs');
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

export const approveJob = createAsyncThunk<AxiosResponse<JobResponse>, ApproveJobRequest, { rejectValue: ApiError }>('/job/approvejob', async (data, { rejectWithValue }) => {
  try {
    const response: Promise<AxiosResponse<JobResponse>> = axiosJobInstance.patch('/approve', data, {
      headers: {
        'x-access-token': typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      }
    });
    toast.promise(response, {
      loading: 'Approving...',
      success: 'Successfully Approved the job'
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

const jobSlice = createSlice({
  name: 'jobState',
  initialState,
  reducers: {
    setOpenJobForm: (state, action) => {
      state.openJobForm = action.payload;
    },
    
    setJobCategory: (state, action) => {
      state.jobCategory = action.payload;
    },

    setJobs: (state, action) => {
      state.fulltimeJobs = action.payload;
    },

    clearAllQueryParams: (state) => {
      state.title = '';
      state.experience = '';
      state.officeType = '';
      state.minSalary = '';
      state.minStipend = '';
      state.internshipType = '';
    },

    setOfficeType: (state, action) => {
      state.officeType = action.payload;
    },

    setExperience: (state, action) => {
      state.experience = action.payload;
    },

    setMinSalary: (state, action) => {
      state.minSalary = action.payload;
    },

    setTitle: (state, action) => {
      state.title = action.payload;
    },

    setInternshipType: (state, action) => {
      state.internshipType = action.payload;
    },

    setMinStipend: (state, action) => {
      state.minStipend = action.payload;
    },

    setEditJobForm: (state, action) => {
      state.editJobForm = action.payload;
    },

    setOpenPostTab: (state, action) => {
      state.openPostTab = action.payload;
    },

    setEditJobDetails: (state, action) => {
      state.editJobDetails = action.payload;
    },

    setSelectPost: (state, action) => {
      state.selectPost = action.payload;
    },

    setJobDrawerCategory: (state, action) => {
      state.jobDrawerCategory = action.payload;
    },

    setOpenFilter: (state, action) => {
      state.openFilter = action.payload;
    },

    setJobId: (state, action) => {
      state.jobIdForApply = action.payload;
    },

    setExternalApplyLink: (state, action) => {
      state.externalApplyLink = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFulltimeJobs.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.fulltimeJobs = action.payload.data?.data;
      })
      .addCase(getJobWithId.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.job = action.payload.data?.data;
      })
      .addCase(getEmployerWithId.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.employer = action.payload.data?.data;
      })
      .addCase(getAllFulltimeJobsByFilter.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.fulltimeJobs = action.payload.data?.data;
      })
      .addCase(getAllInternships.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.internships = action.payload.data?.data;
      })
      .addCase(getAllInternshipsByFilter.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.internships = action.payload.data?.data;
      })
      .addCase(getAllFulltimeJobsByEmployerId.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.employerJobs = action.payload.data?.data;
      })
      .addCase(getAllInternshipsByEmployerId.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.employerInternships = action.payload.data?.data;
      })
      .addCase(getAllPendingJobs.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.pendingJobs = action.payload.data?.data;
      })
      .addCase(approveJob.fulfilled, (state, action) => {
        if(!action.payload) return;
        state.pendingJobs = action.payload.data?.data;
      });
  }
});

export const { setOpenJobForm, setOpenPostTab, setExternalApplyLink, setJobId, clearAllQueryParams, setOpenFilter, setJobDrawerCategory, setSelectPost, setEditJobForm, setEditJobDetails, setJobCategory, setJobs, setOfficeType, setExperience, setMinSalary, setTitle, setInternshipType, setMinStipend } = jobSlice.actions;
export default jobSlice.reducer;