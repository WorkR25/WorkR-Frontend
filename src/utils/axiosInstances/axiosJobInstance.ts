import axios from 'axios';

const axiosJobInstance = axios.create();

axiosJobInstance.defaults.baseURL = process.env.NEXT_PUBLIC_JOB_SERVICE_BASE_URL;

export default axiosJobInstance;