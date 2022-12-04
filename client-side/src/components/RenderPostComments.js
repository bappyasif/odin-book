import { Box, Button, Stack, Typography } from '@mui/material'
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContexts } from '../App'
import { CardHeaderElement } from './MuiElements';
import { ShowPostUserEngagementsDetails } from './SharePostModal';
import { readDataFromServer, updateDataInDatabase } from './utils'

function RenderPostComments({ postId, commentsData, setCommentsData }) {
    let navigate = useNavigate()

    let appCtx = useContext(AppContexts);

    let handleCommentsData = result => setCommentsData(result.data.data)

    let getCommentsFromServer = () => {
        let url = `${appCtx.baseUrl}/comments/post/${postId}/`
        readDataFromServer(url, handleCommentsData)
    }

    useEffect(() => {
        getCommentsFromServer()
    }, [])

    // console.log(commentsData, "CommentsData!!", postId)
    
    let handleShowThread = () => {
        navigate(`posts/${postId}/comments/`)
    }

    let renderComments = () => commentsData.sort((a, b) => a.created < b.created ? 1 : -1)?.map((commentData, idx) => (idx < 4) && <RenderComment key={commentData._id} commentData={commentData} />)

    return (
        <Stack sx={{ alignItems: "center", gap: .6 }}>
            <Typography variant="h6">Post Comments</Typography>
            {commentsData ? renderComments() : null}
            <Button onClick={handleShowThread}>Show Thread</Button>
        </Stack>
    )
}

export const RenderComment = ({ commentData }) => {
    let { body, created, _id, likesCount, dislikesCount, loveCount, userId } = { ...commentData }

    let [counts, setCounts] = useState({})

    let [fetchReady, setFetchReady] = useState(false)

    let [countsForCurrentUser, setCountsForCurrentUser] = useState({})

    let [userData, setUserData] = useState({})

    const appCtx = useContext(AppContexts)

    let handleUserData = (result) => setUserData(result.data.data)

    let getDataAboutThisPostUser = () => {
        let url = `${appCtx.baseUrl}/users/${userId}`
        readDataFromServer(url, handleUserData)
    }

    useEffect(() => {
        userId && getDataAboutThisPostUser()
    }, [])

    let handleCounts = (elem, flag) => setCounts(prev => ({...prev, [elem]: (prev[elem] && !flag) ? prev[elem] + 1 : (prev[elem] && flag) ? prev[elem] - 1 : 1}))
    
    let handleCountsForCurrentUser = (elem, flag) => setCountsForCurrentUser(prev => ({ ...prev, [elem]: (prev[elem] && !flag) ? prev[elem] : (prev[elem] && flag) ? prev[elem] - 1: 1 }))

    let clickHandler = elem => {
        setFetchReady(true);
        !countsForCurrentUser[elem] && handleCounts(elem)
        countsForCurrentUser[elem] && handleCounts(elem, "deduct")
        !countsForCurrentUser[elem] && handleCountsForCurrentUser(elem)
        countsForCurrentUser[elem] && handleCountsForCurrentUser(elem, "deduct")
    }

    let updateCommentCountsData = () => {
        let url = `${appCtx.baseUrl}/comments/${_id}`
        let data = {...counts, userCounts: {...countsForCurrentUser}, userId: appCtx.user._id}
        updateDataInDatabase(url, data)
    }

    useEffect(() => {
        let timer;
        if(fetchReady) {
            timer = setTimeout(() => {
                updateCommentCountsData()

                if(timer >= 2000) {
                    clearTimeout(timer)
                    setFetchReady(false)
                }

            }, [2000])
        }

        return () => clearTimeout(timer)
    }, [fetchReady, counts])

    useEffect(() => {
        setCounts({
            Like: likesCount || 0,
            Dislike: dislikesCount || 0,
            Love: loveCount || 0
        })
        
        let findIdx = commentData.engaggedUsers.findIndex(engaggedUser => engaggedUser && (appCtx.user._id === Object.keys(engaggedUser)[0]?.toString()))
        
        if(findIdx !== -1) {
            // console.log(findIdx, "findIDx", commentData.engaggedUsers[findIdx])
            setCountsForCurrentUser({
                Like: Object.values(commentData.engaggedUsers[findIdx])[0].Like,
                Love: Object.values(commentData.engaggedUsers[findIdx])[0].Love,
                Dislike: Object.values(commentData.engaggedUsers[findIdx])[0].Dislike,
            })
        }
    }, [])

    // console.log(counts, "counts@!", countsForCurrentUser, commentData)

    return (
        <Box
            sx={{
                position: "relative",
                width: "650px",
                outline: "solid .29px red",
                borderRadius: .2,
                mb: .29
                // transform: "scale(.65, .51)",
                // m: 0
            }}
        >
            <CardHeaderElement
                avatarUrl={appCtx.user?.ppUrl || "https://random.imagecdn.app/500/150"}
                altText={"fullname"}
                // title={appCtx.user?.fullName || "User Name"}
                // joined={appCtx.user?.created || Date.now()}
                title={userData?.fullName || "User Name"}
                joined={userData?.created || Date.now()}
                forComment={true}
            />
            <Typography sx={{ color: "text.secondary", position: "absolute", top: 29, right: 20 }} variant="subtitle2">{`Live Since: ${moment(created).fromNow()}`}</Typography>
            <Typography variant='subtitle1' sx={{ backgroundColor: "honeydew", p: .1, mr: 6, ml: 15 }} dangerouslySetInnerHTML={{ __html: body }}></Typography>
            <ShowPostUserEngagementsDetails counts={counts} countsForCurrentUser={countsForCurrentUser} forComment={true} clickHandler={clickHandler} />
        </Box>
    )
}

export default RenderPostComments