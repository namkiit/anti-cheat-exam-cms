import axios, { type AxiosInstance } from 'axios'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
})

export default axiosInstance