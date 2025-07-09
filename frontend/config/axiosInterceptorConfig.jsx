import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://neohire-backend.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const session = localStorage.getItem('session');
    if (session) {
      const { access_token } = JSON.parse(session);
      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors and token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const session = localStorage.getItem('session');
        if (session) {
          const { refresh_token } = JSON.parse(session);
          // Implement your token refresh logic here
          // const response = await axiosInstance.post('/auth/refresh', { refresh_token });
          // const { access_token } = response.data;
          
          // Update the session in localStorage
          // localStorage.setItem('session', JSON.stringify({ ...JSON.parse(session), access_token }));
          
          // Retry the original request
          // originalRequest.headers.Authorization = `Bearer ${access_token}`;
          // return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Handle refresh token failure
        localStorage.removeItem('session');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;   