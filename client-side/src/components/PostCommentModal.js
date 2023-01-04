import { CancelTwoTone, Send } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { VisualizeWordCountProgress } from './CreatePost';

function PostCommentModal({handleShowCommentModal, handleCommentText, handleCommentCounts}) {
    let [commentText, setCommentText] = useState(null);

    const handleText = evt => {
        handleCommentText(evt)
        setCommentText(evt.target.value)
    }
    
    return (
        <Box
            sx={{
                position: "absolute",
                outline: "solid .4px red",
                zIndex: 9,
                backgroundColor: "floralwhite",
                // display: "flex",
                // flexDirection: "column"
                px: 6,
                py: .9,
                borderRadius: 4
            }}
        >
            <Typography variant='h4'>Share Your Comment :)</Typography>

            <VisualizeWordCountProgress textContent={commentText} maxLimit={110} />

            <ShowTextarea handleCommentText={handleText} limit={110} />

            <ShowButtons handleCommentCounts={handleCommentCounts} handleShowCommentModal={handleShowCommentModal} />

        </Box>
    )
}

const ShowButtons = ({handleShowCommentModal, handleCommentCounts}) => {
    let renderButtons = () => actionsBtns.map(item => <ShowButton key={item.name} item={item} handleShowCommentModal={handleShowCommentModal} handleCommentCounts={handleCommentCounts} />)
    
    return (
        <Stack
            sx={{
                display: "flex",
                gap: 2,
                flexDirection: "row",
                justifyContent: "center"
            }}
        >
            {renderButtons()}
        </Stack>
    )
}

const ShowButton = ({ item, handleShowCommentModal, handleCommentCounts }) => {
    let handleSend = () => {
        console.log("send!!")
        handleCommentCounts()
    }

    let handleClick = () => {
        item.name === "Send" && handleSend()
        handleShowCommentModal()
    }

    return (
        <Tooltip
            // sx={{ cursor: "help" }} 
            title={`${item.name} Comment`}
        >
            <Button
                sx={{ cursor: "auto", backgroundColor: "lightgray", pl: 1.8, m: .4 }}
                // startIcon={counts[item.name] ? item.icon : null}
                startIcon={item.icon}
                onClick={handleClick}
            >
                {/* {counts[item.name] ? null : item.icon} */}
                {/* {counts[item.name] ? counts[item.name] : null} */}
                {/* <Send /> */}
                <Typography variant={"subtitle2"}>{item.name}</Typography>
            </Button>
        </Tooltip>
    )
}

const ShowTextarea = ({handleCommentText, limit}) => {
    let [text, setText] = useState(null);
    
    let handleTextChange = evt => {
        setText(evt.target.value)
        handleCommentText(evt)
    }
    // console.log(text, "text!!")

    return (
        <textarea
            // style={{fontSize: ".9rem"}} 
            // onChange={handleTextChange}
            onChange={handleCommentText}
            rows="9" 
            cols="69"
            maxLength={limit}
            placeholder='type in your comment text here....'
        ></textarea>
    )
}


let actionsBtns = [
    { name: "Send", icon: <Send /> },
    { name: "Cancel", icon: <CancelTwoTone /> },
]

export default PostCommentModal