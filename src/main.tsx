import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='556600946131-gkcoeg84so3rs2ufcee63aldhv4ug6i4.apps.googleusercontent.com'>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
)
