import { KeyboardArrowUp } from '@mui/icons-material'
import { Box, Container, Fab, Fade, Stack, Toolbar, Typography, useScrollTrigger } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { AppContexts } from '../../App'
import { RenderComment } from '../RenderPostComments'
import RenderPostDataEssentials from '../RenderPostData'
import { ShowIncludedSharedPost, UserEngagementWithPost } from '../UserCreatedPost'
import { readDataFromServer } from '../utils'

function PostCommentsThread() {
    let [data, setData] = useState({})

    let params = useParams();

    let appCtx = useContext(AppContexts);

    let handlePostData = result => setData(prev => ({ ...prev, postData: result.data.data }))

    let handleCommentsData = result => setData(prev => ({ ...prev, commentsData: result.data.data }))

    let updateCommentsData = (data) => {
        setData(prev => ({ ...prev, commentsData: [...prev.commentsData, data] }))
    }

    const updateCommentTextFromThread = (commentId, commentText) => {
        console.log("update comment dataset here!!", commentId, commentText, data.commentsData)
        
        let newCommentsData = data.commentsData.map(item => {
            if(item._id === commentId) {
                item.body = commentText;
            }
            return item;
        })

        console.log(newCommentsData, "newCommendtsData!!")

        setData(prev => ({ ...prev, commentsData: newCommentsData }))
    }

    let getPostData = () => {
        let url = `${appCtx.baseUrl}/posts/solo/${params.postId}`
        readDataFromServer(url, handlePostData)
    }

    let getCommentsFromServer = () => {
        let url = `${appCtx.baseUrl}/comments/post/${params.postId}/`
        readDataFromServer(url, handleCommentsData)
    }

    useEffect(() => {
        getCommentsFromServer()
        getPostData()
    }, [])

    console.log(data, "!!data!!")

    return (
        data.postData
            ?
            <Box
                width={990}
                margin="auto"
                border={"dotted .4px blue"}
                marginBottom={1.5}
                marginTop={1.3}
                borderRadius={1.1}
                position={"relative"}
            >
                <RenderPostDataEssentials postData={data.postData} />
                {data?.postData?.includedSharedPostId ? <ShowIncludedSharedPost appCtx={appCtx} includedPostId={data.postData.includedSharedPostId} /> : null}
                <UserEngagementWithPost postData={data.postData} appCtx={appCtx} setShowCreatePost={() => null} handleCommentsDataUpdate={updateCommentsData} />
                <RenderThisPostComments commentsData={data.commentsData} updateCommentTextFromThread={updateCommentTextFromThread} />
            </Box>
            : null
    )
}

let RenderThisPostComments = (props) => {
    let [showFab, setShowFab] = useState(false);

    const container = document.querySelector("#top-marker-container")

    const topMarker = document.querySelector("#top-marker")

    let onClickHandler = () => {
        topMarker.scrollIntoView();
        setShowFab(false);
    }

    // let handleScroll = evt => console.log(evt.target, evt.target.clientHeight)
    let handleScroll = evt => console.log(evt.target.clientY, evt.target.clientHeight, evt.clientY)

    // container.addEventListener("wheel", handleScroll)
    container?.addEventListener("scroll", handleScroll)
    // window.addEventListener("scroll", handleScroll)

    let renderComments = () => props.commentsData.sort((a, b) => a.created < b.created ? 1 : -1)?.map((commentData, idx) => <RenderComment key={commentData._id} commentData={commentData} updateCommentTextFromThread={props.updateCommentTextFromThread} fromThread={true} />)

    return (
        <Stack
            sx={{
                alignItems: "center",
                // gap: .6 
                maxHeight: "400px",
                overflowY: "scroll"
            }}
        >
            <Toolbar id="top-marker">
                <Typography variant="h6">Post Comments</Typography>
            </Toolbar>
            {/* <Toolbar id="top-marker" /> */}
            {/* {commentsData ? renderComments() : null} */}
            <Container
                id="top-marker-container"
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: .6, position: "relative" }}
            >
                {props.commentsData ? renderComments() : null}
                <Fab
                    onClick={onClickHandler}
                    sx={{ position: "absolute", right: 20, bottom: 20 }}
                    size="small"
                    aria-label="scroll back to top"
                >
                    <KeyboardArrowUp />
                </Fab>
            </Container>
        </Stack>
    )
}

export let ScrollToTop = (props) => {
    const { children, window } = props;

    // const window = document.querySelector("#top-marker-container")

    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        // target: window || undefined,
        disableHysteresis: true,
        threshold: 200
    })

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector("#top-marker");

        if (anchor) {
            anchor.scrollIntoView({
                block: "center"
            })
        }
    }

    return (
        <Fade in={trigger}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{
                    position: "fixed",
                    bottom: 29,
                    right: 26
                }}
            >
                {children}
            </Box>
        </Fade>
    )
}

export default PostCommentsThread