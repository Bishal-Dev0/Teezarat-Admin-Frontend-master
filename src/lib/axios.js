import axios from 'axios'

export const http = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || '',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

http.interceptors.request.use(
  (config) => ({
    ...config,
    headers: { teezarat: localStorage.getItem('token') },
  }),
  (err) => err
)
