import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || 'An error occurred';
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Network error - please check your connection');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// Booking API endpoints
export const bookingAPI = {
  // Get all bookings with filters and pagination
  getBookings: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    return api.get(`/bookings${queryString ? `?${queryString}` : ''}`);
  },

  // Search bookings
  searchBookings: (query) => {
    return api.get(`/bookings/search?q=${encodeURIComponent(query)}`);
  },

  // Get single booking
  getBooking: (id) => {
    return api.get(`/bookings/${id}`);
  },

  // Create new booking
  createBooking: (bookingData) => {
    return api.post('/bookings', bookingData);
  },

  // Update booking
  updateBooking: (id, bookingData) => {
    return api.put(`/bookings/${id}`, bookingData);
  },

  // Delete booking
  deleteBooking: (id) => {
    return api.delete(`/bookings/${id}`);
  },
};

// Utility function to format API errors
export const formatAPIError = (error) => {
  if (error.response?.data?.errors) {
    // Handle validation errors
    return error.response.data.errors.map(err => err.msg || err.message).join(', ');
  }
  
  return error.message || 'An unexpected error occurred';
};

export default api;