import axios from 'axios';

const axiosUserInstance = axios.create();

axiosUserInstance.defaults.baseURL = process.env.NEXT_PUBLIC_USER_SERVICE_BASE_URL;

export default axiosUserInstance;