import axios from 'axios';

const axiosApplicationInstance = axios.create();

axiosApplicationInstance.defaults.baseURL = process.env.NEXT_PUBLIC_APPLICATION_SERVICE_BASE_URL;

export default axiosApplicationInstance;