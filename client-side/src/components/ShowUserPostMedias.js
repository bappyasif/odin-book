import { Gif } from '@giphy/react-components';
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
            sx={{ display: "flex", flexDirection: "column", mb: 2 }}
        >
            {renderContents()}
        </Box>
    )
}

const ShowPoll = ({ pollData, order, postId }) => {
    let { votersList, question, ...options } = { ...pollData }

    // let [usersVoted, setUsersVoted] = useState([])

    let [voted, setVoted] = useState(false);

    let [voteAttempted, setVoteAttempted] = useState(false);

    const appCtx = useContext(AppContexts)

    const dataUpdater = result => console.log(result, "data!!")

    const checkUserAlreadyVoted = () => {
        const foundUser = votersList?.find(id => id === appCtx.user._id)
        return foundUser?.length
    }

    // const checkUserAlreadyVoted = () => {
    //     const foundUser = votersList ? votersList.find(id => id === appCtx.user._id) : false
    //     return foundUser
    // }

    // const updateVotersList = () => setUsersVoted(prev => [...prev, appCtx.user._id])

    const updateDataWithVoters = () => {
        let updatedList = [];

        if(votersList?.length && !checkUserAlreadyVoted()) {
            updatedList = votersList.push(appCtx.user._id)
        } else {
            updatedList.push(appCtx.user._id)
            console.log(appCtx.user._id, "appCtx.user._id")
        }

        const data = { propKey: "poll", propValue: [{ votersList: updatedList, question, ...options }] }

        const url = `${appCtx.baseUrl}/posts/update/shared/${postId}`

        updateDataInDatabase(url, data, dataUpdater)
        
        console.log(data, 'ready!!', updatedList, [].push(appCtx.user._id))
    }

    const updatePostPollDataInDatabase = (optionCountObj) => {
        console.log(optionCountObj, options)
        options[optionCountObj.optionNum] = optionCountObj;

        setVoteAttempted(true);
        updateDataWithVoters()

        // if (!checkUserAlreadyVoted()) {
        //     // updateDataWithVoters();

        //     // updateVotersList();

        //     // const data = { propKey: "poll", propValue: [{ votersList: usersVoted, question, ...options }] }

        //     // const url = `${appCtx.baseUrl}/posts/update/shared/${postId}`

        //     // updateDataInDatabase(url, data, dataUpdater)
        //     // console.log(data, 'ready!!')
        // } else {
        //     setVoteAttempted(true)
        // }

        // const data = {propKey: "poll", propValue: [{question, ...options}]}
        // const data = {propKey: "poll", propValue: [{question, ...options}]}

        // const url = `${appCtx.baseUrl}/posts/update/shared/${postId}`
        // updateDataInDatabase(url, data, dataUpdater)
        // console.log(data, 'ready!!')
    }

    let renderOptions = () => {
        let allOptions = [];
        for (let key in options) {
            // let temp = { number: key, text: options[key] }
            let temp = { number: key, text: options[key].text || options[key], count: options[key].count || 0 }
            allOptions.push(<RenderPollOption setVoteAttempted={setVoteAttempted} voted={voted} setVoted={setVoted} key={key} option={temp} numberOfOptions={Object.values(options).length} updatePostPollDataInDatabase={updatePostPollDataInDatabase} />)
        }
        return [...allOptions];
    }

    
    // useEffect(() => {
    //     if(usersVoted.length > votersList && votersList?.length) {
    //         updateDataWithVoters()
    //     }
    // }, [usersVoted])

    // useEffect(() => {
    //     setUsersVoted(votersList && votersList?.length ? votersList : [])
    // }, [])

    useEffect(() => {
        if(checkUserAlreadyVoted()) {
            setVoted(true);
            setVoteAttempted(true);
        }
    }, [])

    // console.log(usersVoted.length, votersList && votersList?.length, usersVoted.length > votersList && votersList?.length)

    return (
        <Paper sx={{ mb: 2, order: order }}>
            <Typography
                variant='h4'
            >Poll Question: {question}</Typography>

            {(voteAttempted) ? <VoteAlert setVoteAttempted={setVoteAttempted} /> : null}

            <Divider sx={{ mb: 3.5 }} />

            <Stack
                sx={{ flexDirection: "column", gap: 1.1, flexWrap: "wrap", height: "290px", alignItems: renderOptions().length >= 3 ? "center" : "center" }}
            >
                {renderOptions()}
            </Stack>
        </Paper>
    )
}

const VoteAlert = ({ setVoteAttempted }) => {
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
        <Alert sx={{ justifyContent: "center", position: "absolute", left: "35%" }} severity="success">You Voted, One Vote Per User!!</Alert>
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
            sx={{ m: 1, mb: 2, width: numberOfOptions >= 3 ? (window.innerWidth / 6) : "100%", flexDirection: "column", justifyContent: "flex-start" }}
            onClick={handleCount}
        >
            <Typography
                className="slider"
                sx={{
                    textAlign: "left",
                    height: 2.9,
                    width: clickCount / window.innerWidth * numberOfOptions,
                    backgroundColor: "red"
                }}></Typography>
            <ListItemText
                sx={{
                    textAlign: "justify",
                    alignSelf: "flex-start"
                }}
                primary={
                    <Typography variant='h6'>{option.number + ` -- << ${clickCount} >> votes`}</Typography>
                }
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