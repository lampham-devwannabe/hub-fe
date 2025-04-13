import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  // headers: {
  //   'Content-Type': 'application/json',
  // },
  withCredentials: true // Include credentials (cookies) in requests
})

api.interceptors.request.use(
  (config) => {
    // Token nằm trong cookie rồi nên không cần attach Authorization nữa
    return config
  },
  (error) => Promise.reject(error)
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

export default api
