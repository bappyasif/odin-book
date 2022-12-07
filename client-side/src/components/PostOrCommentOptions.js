import { DangerousTwoTone, DvrTwoTone, SettingsSuggestTwoTone } from '@mui/icons-material';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContexts } from '../App';
import { useToCloseModalOnClickedOutside } from './hooks/toDetectClickOutside';
import { deleteResourceFromServer } from './utils';

export const PostOrCommentOptions = ({ postId, commentId, deleteCommentFromDataset }) => {
    let [clickedOptions, setClickedOptions] = useState(false);

    let ref = useRef();

    useToCloseModalOnClickedOutside(ref, () => setClickedOptions(false))

    let options = [{ text: "Delete", icon: <DangerousTwoTone /> }, { text: "Thread", icon: <DvrTwoTone /> }]

    if (commentId) {
        options = options.filter(item => item.text !== "Thread");
    }
    // let renderOptions = () => options.map(item => !(commentId && item.text !== "Thread") && <RenderPostOption key={item.text} item={item} postId={postId} commentId={commentId} deleteCommentFromDataset={deleteCommentFromDataset} />)
    let renderOptions = () => options.map(item => <RenderPostOption key={item.text} item={item} postId={postId} commentId={commentId} deleteCommentFromDataset={deleteCommentFromDataset} openDropdown={setClickedOptions} />)

    let handleClick = () => setClickedOptions(!clickedOptions)

    return (
        <Box
            sx={{
                position: "absolute",
                right: 0,
                top: 0,
                pr: .9,
            }}
        >
            <SettingsSuggestTwoTone onClick={handleClick} />
            {
                clickedOptions
                    ? <Stack
                        ref={ref}
                        sx={{
                            position: "absolute",
                            right: 0,
                            top: 22,
                            backgroundColor: "gainsboro",
                            p: 1.1,
                            zIndex: 9,
                            gap: 1.1
                        }}>{renderOptions()}</Stack>
                    : null
            }
        </Box>
    )
}

let RenderPostOption = ({ item, postId, commentId, deleteCommentFromDataset, openDropdown }) => {
    let appCtx = useContext(AppContexts);

    const navigate = useNavigate()

    let deleteThisPostFromAppData = () => {
        if (postId) {
            appCtx.deletePostFromAvailablePostsFeeds(postId)
        } else {
            deleteCommentFromDataset(commentId)
        }
    }

    const commenceDelete = (url, data) => {
        const userChoice = prompt("Are you sure you want to delete? Deleted data is not again retrieveable....Type in Y to delete", "N")
        
        if (userChoice === "Y" || userChoice === "y") {
            deleteResourceFromServer(url, data, deleteThisPostFromAppData)
        } else {
            alert("you chose not to delete :)")
        }
        
        openDropdown(false)
    }

    const handleClick = () => {
        if (commentId) {
            if (item.text === "Delete") {
                const url = `${appCtx.baseUrl}/comments/${commentId}`
                const data = { commentId: commentId }
                commenceDelete(url, data)
            }
        } else {
            if (item.text === "Delete") {
                const url = `${appCtx.baseUrl}/posts/${postId}`
                const data = { postId: postId }
                commenceDelete(url, data)
            } else {
                console.log("thread", postId)
                navigate(`posts/${postId}/comments/`)
            }
        }
    }
    
    return (
        <Tooltip title={item.text}>
            <Button
                onClick={handleClick}
                startIcon={item.icon}
                sx={{
                    outline: "solid 2px red",
                }}
            >
                <Typography>{item.text}</Typography>
            </Button>
        </Tooltip>
    )
}