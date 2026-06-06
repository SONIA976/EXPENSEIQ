import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import UserProvider from './context/UserContext'
import AppErrorBoundary from './components/AppErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
      <ThemeProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  </StrictMode>,
)
