import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  // headers: {
  //   'Content-Type': 'application/json',
  // },
  withCredentials: true // Include credentials (cookies) in requests
})

api.interceptors.request.use(
  (response) => {
    const data = response.data
    if (data && typeof data.code === 'number' && data.code !== 1000) {
      return Promise.reject(new Error(data.message || 'Internal server error'))
    }
    return response
  },
  (error) => {
    // Network or server errors (not API code logic)
    return Promise.reject(error)
  }
)

// api.interceptors.response.use(
//     (res) => res,
//     (err) => {
//       if (err.response.status === 401) {
//         //todo
//       }
//       return Promise.reject(err);
//     }
//   );
export interface ApiResponse<T> {
  code: number // 1000 = success
  message: string // Message from backend
  result: T // Actual data
}

export default api
