import { Gif } from '@giphy/react-components';
import { Box, Divider, ListItem, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { ShowRespectiveIcon } from './ChoosePrivacy';

function ShowUserPostMedias({ mediaContents }) {
    let generateContents = () => {
        let content = [];

        for (let key in mediaContents) {
            if (key === "Image" && mediaContents[key]?.includes("http")) {
                content.push(<img key={"Image"} src={mediaContents[key]} style={{order: 1}} />)
            } else if (key === "Image" && !mediaContents[key]?.includes("http")) {
                content.push(<img key={"Image"} src={handleMediaFileChecks(mediaContents[key])} style={{order: 1}} />)
            } else if (key === "Video" && mediaContents[key]?.includes("http")) {
                content.push(<video key={"Video"} height={200} src={mediaContents[key]} controls style={{order: 2}} />)
                // content.push(<video controls><source src={mediaContents[key]} /></video>)
                // content.push(<iframe src={mediaContents[key]} controls></iframe>)
            } else if (key === "Gif" && mediaContents[key]) {
                content.push(<Gif key={"Gif"} gif={mediaContents[key]} height={200} width={"100%"}  style={{order: 3}} />)
            } else if (key === "Poll" && mediaContents[key]) {
                content.push(<ShowPoll key={"Poll"} pollData={mediaContents[key]} order={4} />)
            } else if (key === "Privacy") {
                content.push(<ShowRespectiveIcon key={"Privacy"} privacy={mediaContents[key]} order={5} />)
            }

        }

        return content
    }

    let renderContents = () => [...generateContents()]
    // console.log(generateContents())

    return (
        <Box
            sx={{display: "flex", flexDirection: "column", mb: 2}}
        >
            {renderContents()}
        </Box>
    )
}

const ShowPoll = ({ pollData, order }) => {
    let { question, ...options } = { ...pollData }

    let renderOptions = () => {
        let allOptions = [];
        for (let key in options) {
            let temp = { number: key, text: options[key] }
            allOptions.push(<RenderPollOption key={key} option={temp} />)
        }
        return [...allOptions];
    }

    return (
        <Paper sx={{ mb: 2, order: order }}>
            <Typography variant='h4'>Poll Question: {question}</Typography>
            <Divider />
            <Stack
                sx={{ flexDirection: "row", gap: 1.1 }}
            >
                {renderOptions()}
            </Stack>
        </Paper>
    )
}

const RenderPollOption = ({ option }) => {
    let [clickCount, setClickCount] = useState(0);

    let handleCount = () => {
        setClickCount(prev => prev < 20 ? prev + 1 : prev)
    }

    useEffect(() => setClickCount(option.count || 0), [])

    return (
        <ListItemButton
            sx={{ m: 1, mb: 2, width: (window.innerWidth / 6), flexDirection: "column" }}
            onClick={handleCount}
        >
            <Typography
                class="slider"
                sx={{
                    textAlign: "left",
                    height: 2.9,
                    width: clickCount / 100 * 5,
                    backgroundColor: "red"
                }}></Typography>
            <ListItemText
                primary={option.number + "<< count >>" + clickCount}
                secondary={
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="h4"
                        color="text.primary"
                    >
                        {option.text}
                    </Typography>
                }
            />
        </ListItemButton>
    )
}

// handling media file checks
export let handleMediaFileChecks = (mediaFile) => {
    let mediaSrc = mediaFile;
    if (mediaFile instanceof File || mediaFile instanceof Blob || mediaFile instanceof MediaSource) {
        mediaSrc = URL.createObjectURL(mediaFile)
    }
    return mediaSrc;
}

export default ShowUserPostMedias