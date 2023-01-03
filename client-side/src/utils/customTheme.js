import { grey } from '@mui/material/colors';

export const getDesignTokens = (mode) => ({
    palette: {
        mode,
        primary: {
            // ...amber,
            ...(mode === 'dark' && {
                main: "#22223B",
            }),
            ...(mode === 'light' && {
                main: "#4A4E69",
                secondary: "#001845"
            }),
        },
        secondary: {
            // ...amber,
            ...(mode === 'dark' && {
                main: "#4A4E69",
            }),
            ...(mode === 'light' && {
                main: "#C9ADA7",
            }),
        },
        ...(mode === 'dark' && {
            background: {
                default: "#4A4E69",
                paper: "#22223B",
            },
            info: {
                main: "#001845"
            }
        }),
        ...(mode === 'light' && {
            background: {
                default: "#F2E9E4",
                // paper: "#6D6875",
            },
            info: {
                // main: "#6D6875"
                main: "#FEFAE0"
            }
        }),
        text: {
            ...(mode === 'light'
                ? {
                    primary: grey[900],
                    secondary: grey[800],
                }
                : {
                    primary: grey[400],
                    secondary: grey[200],
                    // info: {
                    //   contrastText: grey[200]
                    // }
                }),
        },
    },
});

// const theme = createTheme({
  //   palette: {
  //     mode: darkMode ? "dark" : "light",
  //   }
  // })