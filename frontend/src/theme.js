import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'Sora, Arial, sans-serif'
    },
    palette: {
        primary: {
            main: '#7765DA',
            dark: '#4F0DCE',
            light: '#5767D0',
        },
        secondary: {
            main: '#373737',
            light: '#6E6E6E',
        },
        background: {
            default: '#F2F2F2'
        },
        text:{
            primary: '#373737',
            secondary: '#6E6E6E',
        }
    },
    paletteExtra: {
        purple: '#7765DA',
        blue: '#5767D0',
        violet: '#4F0DCE',
        lightGray: '#F2F2F2',
        darkGray: '#373737',
        gray: '#6E6E6E',
    },
});

export default theme;