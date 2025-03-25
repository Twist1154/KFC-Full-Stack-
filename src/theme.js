import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E4002B', // kfc-red
    },
    secondary: {
      main: '#202020', // kfc-black
    },
    background: {
      default: '#FFFFFF', // kfc-white
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
});

export default theme;