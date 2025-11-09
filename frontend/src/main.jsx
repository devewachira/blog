import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "@/components/ui/sonner"
import { Provider } from 'react-redux'
import store from './redux/Store'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import ThemeProvider from './components/ThemeProvider'
import axios from 'axios'
import { toast } from 'sonner'

// Axios global config and error handling
axios.defaults.withCredentials = true
// In development, prefer relative URLs so Vite proxy keeps same-origin cookies
if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL
} else {
  console.warn('Using relative API URLs (dev). Ensure Vite proxy is configured for /api.')
}
axios.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && config.url.startsWith('undefined')) {
    console.warn('Request URL starts with "undefined". Check VITE_API_URL. URL:', config.url)
  }
  return config
})
axios.interceptors.response.use(
  (response) => response,
  (error) => {
const cfg = error?.config || {}
const method = (cfg.method || 'GET').toUpperCase()
const isAbsolute = typeof cfg.url === 'string' && /^https?:\/\//i.test(cfg.url)
const url = isAbsolute ? (cfg.url || '') : `${cfg.baseURL || ''}${cfg.url || ''}`
    const status = error?.response?.status
    const msg = error?.response?.data?.message || error?.message || 'Request failed'

    console.error('API error:', {
      method,
      url,
      status,
      data: error?.response?.data,
      stack: error?.stack
    })
    try { toast.error(`${method} ${url} -> ${status || 'ERR'}: ${msg}`) } catch {}
    return Promise.reject(error)
  }
)

// Window-level error visibility
window.addEventListener('error', (e) => {
  console.error('Window Error:', e.message, e.error)
})
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason)
})

const persistor = persistStore(store)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} >
        <ThemeProvider>
        <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
    <Toaster />
  </StrictMode>,
)

