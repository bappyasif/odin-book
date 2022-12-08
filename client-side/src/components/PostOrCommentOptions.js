import { DangerousTwoTone, DvrTwoTone, ModeEditTwoTone, SettingsSuggestTwoTone } from '@mui/icons-material';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContexts } from '../App';
import { useToCloseModalOnClickedOutside } from './hooks/toDetectClickOutside';
import { deleteResourceFromServer } from './utils';

export const PostOrCommentOptions = ({ postOwner, postId, commentId, deleteCommentFromDataset, userId, showEditableText }) => {
    let [clickedOptions, setClickedOptions] = useState(false);

    let ref = useRef();

    useToCloseModalOnClickedOutside(ref, () => setClickedOptions(false))

    let options = [{ text: "Edit", icon: <ModeEditTwoTone /> }, { text: "Delete", icon: <DangerousTwoTone /> }, { text: "Thread", icon: <DvrTwoTone /> }]

    if (commentId) {
        options = options.filter(item => item.text !== "Thread");
    } else if (postId) {
        options = options.filter(item => item.text !== "Edit");
    }

    let renderOptions = () => options.map(item => <RenderPostOption key={item.text} postOwner={postOwner} item={item} postId={postId} commentId={commentId} deleteCommentFromDataset={deleteCommentFromDataset} openDropdown={setClickedOptions} userId={userId} showEditableText={showEditableText} />)

    let handleClick = () => setClickedOptions(!clickedOptions)

    return (
        <Box
            ref={ref}
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
                        // ref={ref}
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

let RenderPostOption = ({ postOwner, item, postId, commentId, deleteCommentFromDataset, openDropdown, userId, showEditableText }) => {
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
    }

    const optionsActions = () => {
        if (commentId) {
            if (item.text === "Delete") {
                const url = `${appCtx.baseUrl}/comments/${commentId}`
                const data = { commentId: commentId }
                commenceDelete(url, data)
            } else if (item.text === "Edit") {
                console.log("Edit here!!")
                showEditableText(true)
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

    const handleClick = () => {
        if (postOwner && item.text === "Delete") {
            optionsActions()
        } else if (
            (userId !== appCtx.user._id) && (item.text !== "Thread")
            ||
            (!appCtx.user._id && item.text !== "Thread")
        ) {
            alert("This is not an authorized action, probably you are not owner of this content....")
        } else {
            optionsActions()
        }

        openDropdown(false)
    }

    return (
        <Tooltip title={(!appCtx.user._id && item.text !== "Thread") ? `Login to ${item.text}` : item.text}>
            <Button
                onClick={(!appCtx.user._id && item.text === "Thread") ? handleClick : (appCtx.user._id) ? handleClick : null}
                startIcon={item.icon}
                sx={{
                    outline: "solid 2px red",
                    position: "relative"
                }}
            >
                <Typography>{item.text}</Typography>
            </Button>
        </Tooltip>
    )
}