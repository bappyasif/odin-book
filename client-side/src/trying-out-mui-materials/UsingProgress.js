import { Box, CircularProgress, Fab, Typography, Button, LinearProgress, Paper } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import { green } from '@mui/material/colors'
import React, { useEffect, useState } from 'react'

function UsingProgress() {
    let [progress, setProgress] = useState(0)
    useEffect(() => {
        let timer = setInterval(() => setProgress(prev => prev >= 100 ? 0 : prev + 10), 1000)
        return () => clearInterval(timer)
    }, [])
    return (
        <div>
            <Typography variant='h1'>UsingProgress</Typography>
            {/* indeterminant progress bar loading */}
            <CircularProgress />
            <CircularProgress color='secondary' />
            {/* determinant progress bar loading */}
            <CircularProgress variant='determinate' color='success' value={45} />
            <CircularProgress variant='determinate' color='success' value={progress} />

            {/* linear progress bar loading */}
            <LinearProgress />
            <LinearProgress variant='determinate' value={progress} color={"info"} />

            <Box>
                <Paper sx={{height: 110, backgroundColor: theme => "secondary.main"}} elevation={0} />
                <Paper sx={{ backgroundColor: "red", height: 20, border: 6 }} elevation={1} />
            </Box>

            <CircularIntegration />
        </div>
    )
}

export function CircularIntegration() {
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const timer = React.useRef();

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };

    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const handleButtonClick = () => {
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            timer.current = window.setTimeout(() => {
                setSuccess(true);
                setLoading(false);
            }, 2000);
        }
    };

    return (
        // Box component works as a div
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ m: 1, position: 'relative' }}>
                <Fab
                    aria-label="save"
                    color="primary"
                    sx={buttonSx}
                    onClick={handleButtonClick}
                >
                    {success ? <CheckIcon /> : <SaveIcon />}
                </Fab>
                {loading && (
                    <CircularProgress
                        size={68}
                        sx={{
                            color: green[500],
                            position: 'absolute',
                            top: -6,
                            left: -6,
                            zIndex: 1,
                        }}
                    />
                )}
            </Box>
            <Box sx={{ m: 1, position: 'relative' }}>
                <Button
                    variant="contained"
                    sx={buttonSx}
                    disabled={loading}
                    onClick={handleButtonClick}
                >
                    Accept terms
                </Button>
                {loading && (
                    <CircularProgress
                        size={24}
                        sx={{
                            color: green[500],
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                        }}
                    />
                )}
            </Box>
            <Paper elevation={0} />
            <Paper sx={{ backgroundColor: "red" }} elevation={1} />
        </Box>
    );
}

export default UsingProgress