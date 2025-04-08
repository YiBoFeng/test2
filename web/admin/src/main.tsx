import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider, createTheme } from '@mui/material'
import { interceptAuthentication } from '@apis/interceptAuthentication'
import '@themes/styles/index.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#5392ff',
    },
  },
})
interceptAuthentication()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
