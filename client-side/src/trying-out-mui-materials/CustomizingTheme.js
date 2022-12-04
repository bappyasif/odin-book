import { createTheme, CssBaseline, Paper, ThemeProvider, Typography } from '@mui/material'
import { yellow } from "@mui/material/colors"
import React from 'react'

function CustomizingTheme() {
    const theme = createTheme({
        // changing default spacing value of 4 to 6, whenever props like m, p are used 
        // they will multiplied by this nuber to allocate those amount of spacing evenly throughout app
        spacing: 6,
        // anything in here will overwrite default theme values keeping rest unchanged in there
        palette: {
            mode: "dark",
            // primary: {
            //     main: deepPurple[600]
            // }

            // we can even make our custom instances for our theme
            // lets try a custom color palette
            customClrYellow: {
                main: yellow[400],
                superDark: yellow[800],
                superLight: yellow[200]
            }
        },
        typography: {
            // for all elemnts we can change font size through out our app including non typographical elements such as a div
            fontSize: 18,
            // fontFamily: "monospace",
            // specific to h3 only
            h3: {
                // default is about 3rem
                fontSize: "6rem",
                fontFamily: "monospace",
            },

            // we can also have a custom variant as well
            myVariant: {
                fontSize: "4rem"
            }
        }
    })
    return (
        <ThemeProvider theme={theme}>
            {/* using css baseline will make entire app take effect of "mode" */}
            {/* padding will be gone, gets dark mode, and defualts regular typography sizes for html elements */}
            {/* this should be used just once in app, it will work as a css baseline for entire app and start adding styles on top of it */}
            <CssBaseline />
            <div>
                <Typography variant={"h2"}>Themeing Example</Typography>
                <Typography color={"primary.light"}>Color Changes</Typography>
            </div>

            {/* paper is working as a background to this wrap and not to entire component for that we would have to use css baseline */}
            <Paper>
                <Typography variant={"h3"}>Themeing Example</Typography>
                <Typography color={"primary"}>Color Changes</Typography>
                <Typography variant={"h4"} sx={{color: "customClrYellow.main"}}>Custom Color Usecase Example</Typography>
                <Typography variant={"myVariant"} sx={{color: "customClrYellow.main"}}>Custom Typography Variant Example</Typography>
            </Paper>
        </ThemeProvider>
    )
}

export default CustomizingTheme