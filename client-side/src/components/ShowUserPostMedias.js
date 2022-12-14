import { Gif } from '@giphy/react-components';
import { ChevronLeftTwoTone, ChevronRightTwoTone } from '@mui/icons-material';
import { Alert, Box, Divider, ListItem, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { AppContexts } from '../App';
import { updateDataInDatabase } from '../utils';
import { ShowRespectiveIcon } from './ChoosePrivacy';

function ShowUserPostMedias({ mediaContents }) {
    let generateContents = () => {
        let content = [];

        for (let key in mediaContents) {
            if (key === "Image" && mediaContents[key]?.includes("http")) {
                content.push(<img key={"Image"} src={mediaContents[key]} style={{ order: 1 }} />)
            } else if (key === "Image" && !mediaContents[key]?.includes("http")) {
                content.push(<img key={"Image"} src={handleMediaFileChecks(mediaContents[key])} style={{ order: 1 }} />)
            } else if (key === "Video" && mediaContents[key]?.includes("http")) {
                content.push(<video key={"Video"} height={200} src={mediaContents[key]} controls style={{ order: 2 }} />)
                // content.push(<video controls><source src={mediaContents[key]} /></video>)
                // content.push(<iframe src={mediaContents[key]} controls></iframe>)
            } else if (key === "Gif" && mediaContents[key]) {
                content.push(<Gif key={"Gif"} gif={mediaContents[key]} height={{ lg: "100%" }} width={"100%"} style={{ order: 3 }} />)
            } else if (key === "Poll" && mediaContents[key]) {
                content.push(<ShowPoll key={"Poll"} pollData={mediaContents[key]} postId={mediaContents.Id} order={4} />)
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
            sx={{ display: "flex", flexDirection: "column", mb: 2, gap: 2 }}
        >
            {renderContents()}
        </Box>
    )
}

const ShowPoll = ({ pollData, order, postId }) => {
    let { votersList, question, ...options } = { ...pollData }

    let [voted, setVoted] = useState(false);

    let [voteAttempted, setVoteAttempted] = useState(false);

    const appCtx = useContext(AppContexts)

    // const dataUpdater = result => console.log(result, "data!!")
    const dataUpdater = result => console.log(result, "poll data!!")

    const checkUserAlreadyVoted = () => {
        const foundUser = votersList?.length ? votersList?.filter(id => id === appCtx.user._id) : []

        return foundUser?.length
    }

    const updateDataWithVoters = () => {
        let updatedList = [];

        if (votersList?.length && !checkUserAlreadyVoted()) {
            updatedList = votersList.push(appCtx.user._id)
        } else {
            updatedList.push(appCtx.user._id)
            // console.log(appCtx.user._id, "appCtx.user._id")
        }

        const data = { propKey: "poll", propValue: [{ votersList: updatedList, question, ...options }] }

        const url = `${appCtx.baseUrl}/posts/update/shared/${postId}`

        updateDataInDatabase(url, data, dataUpdater)

        console.log(data, 'ready!!', updatedList, [].push(appCtx.user._id))
    }

    const updatePostPollDataInDatabase = (optionCountObj) => {
        // console.log(optionCountObj, options, options[optionCountObj.optionNum])
        options[optionCountObj.optionNum] = optionCountObj;

        setVoteAttempted(true);
        updateDataWithVoters();
    }

    let renderOptions = () => {
        let allOptions = [];
        for (let key in options) {
            let temp = { number: key, text: options[key].text || options[key], count: options[key].count || 0 }
            allOptions.push(<RenderPollOption setVoteAttempted={setVoteAttempted} voted={voted} setVoted={setVoted} key={key} option={temp} numberOfOptions={Object.values(options).length} updatePostPollDataInDatabase={updatePostPollDataInDatabase} />)
        }
        return [...allOptions];
    }

    useEffect(() => {
        if (checkUserAlreadyVoted()) {
            setVoted(true);
            setVoteAttempted(true);
        } else {
            setVoted(false);
            setVoteAttempted(false);
        }
    }, [])

    // console.log(usersVoted.length, votersList && votersList?.length, usersVoted.length > votersList && votersList?.length)

    return (
        <Paper sx={{ mb: 2, order: order, pointerEvents: appCtx.user._id ? "auto" : "none" }}>
            <Typography
                variant='h4'
            >Poll Question: {question}</Typography>

            {!appCtx?.user?._id ? <VoteAlert setVoteAttempted={setVoteAttempted} text={'You need to be logged in before casting your Vote!!'} severity={"warning"} /> : null}

            {(voteAttempted) ? <VoteAlert setVoteAttempted={setVoteAttempted} text={'You Voted, One Vote Per User!!'} severity={"success"} /> : null}

            <Divider sx={{ mb: 3.5 }} />

            <Stack
                sx={{ flexDirection: "column", gap: 1.1, flexWrap: "wrap", height: "290px", alignItems: renderOptions()?.length >= 3 ? "center" : "center" }}
            >
                {renderOptions()}
            </Stack>
        </Paper>
    )
}

const VoteAlert = ({ setVoteAttempted, text, severity }) => {
    const beginTimer = () => {
        const timer = setTimeout(() => {
            setVoteAttempted(false)

            return () => clearTimeout(timer);
        }, 2000)
    }

    useEffect(() => {
        beginTimer()
    }, [])

    return (
        <Alert sx={{ justifyContent: "center", position: "absolute", left: "35%" }} severity={severity}>{text}</Alert>
    )
}

const RenderPollOption = ({ setVoteAttempted, option, numberOfOptions, updatePostPollDataInDatabase, voted, setVoted }) => {
    let [clickCount, setClickCount] = useState(0);
    // let [voted, setVoted] = useState(false);

    let handleCount = () => {
        // const 
        // setClickCount(prev => prev < 20 ? prev + 1 : prev)

        setVoted(true);
        !voted && setClickCount(prev => prev + 1)
        setVoteAttempted(true)
    }

    const handleWhichOptionVoted = () => {
        // const optionData = { optionNum: option.number, text: option.text, count: clickCount }
        const optionData = { optionNum: option.number, text: option.text, count: clickCount }
        updatePostPollDataInDatabase(optionData)
        // setVoted(false);
    }

    useEffect(() => {
        voted && handleWhichOptionVoted()
    }, [voted])

    useEffect(() => {
        setClickCount(option.count || 0);
        setVoted(false);
        setVoteAttempted(false);
    }, [])

    return (
        <ListItemButton
            sx={{ backgroundColor: "primary.light", borderRadius: 6, m: 1, mb: 2, width: numberOfOptions >= 3 ? (window.innerWidth / 6) : "100%", flexDirection: "column", justifyContent: "flex-start" }}
            onClick={handleCount}
        >
            {/* <Typography
                className="slider"
                sx={{
                    textAlign: "left",
                    height: 2.9,
                    width: clickCount / window.innerWidth * numberOfOptions,
                    backgroundColor: "red"
                }}></Typography> */}
            <ListItemText
                sx={{
                    textAlign: "justify",
                    alignSelf: "flex-start"
                }}
                primary={
                    <>
                        <Typography
                            className="slider"
                            sx={{
                                textAlign: "left",
                                height: "33px",
                                width: ((clickCount / window.innerWidth) / numberOfOptions) * 100,
                                // width: clickCount / window.innerWidth * numberOfOptions,
                                backgroundColor: "secondary.dark",
                                position: "absolute",
                                opacity: .51
                            }}></Typography>
                        <Typography variant='h5' sx={{color: "chartreuse", display: "flex", alignItems: "center", fontWeight: "bold"}}><ChevronLeftTwoTone fontSize='large' /> {` ${clickCount} `} <ChevronRightTwoTone fontSize='large' /> Votes</Typography>
                    </>
                    // <Typography variant='h6'>{`<< ${clickCount} >> votes`}</Typography>
                    // <Typography variant='h6'>{option.number + ` -- << ${clickCount} >> votes`}</Typography>
                }
                secondary={
                    <Typography
                        sx={{ display: 'inline', fontWeight: "bold" }}
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