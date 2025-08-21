import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4f8cff' },
    background: { default: '#0b1220', paper: '#121a2b' },
  },
  shape: { borderRadius: 12 },
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="dark" />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)


