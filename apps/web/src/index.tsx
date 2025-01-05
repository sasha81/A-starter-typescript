import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/styles';
import theme from './components/common/Theme';
import { App } from './App';
import { CssBaseline } from '@mui/material';

const app = document.querySelector('#app')
if (app) createRoot(app).render(
  (
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CssBaseline>
  ))