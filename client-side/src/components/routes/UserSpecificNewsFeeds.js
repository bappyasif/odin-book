import { KeyboardArrowUp } from '@mui/icons-material';
import { Button, Fab, IconButton, Paper, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { TwitterTimelineEmbed, TwitterShareButton, TwitterFollowButton, TwitterHashtagButton, TwitterMentionButton, TwitterTweetEmbed, TwitterMomentShare, TwitterDMButton, TwitterVideoEmbed, TwitterOnAirButton } from 'react-twitter-embed';
import { AppContexts } from '../../App'
import CreatePost from '../CreatePost';
import { RenderPost } from '../ShowPostsFromTwitter';
import ShowUserCreatedPost from '../UserCreatedPost';
import { readDataFromServer } from '../utils';
import { ScrollToTop } from './PostCommentsThread';

function UserSpecificNewsFeeds(props) {
    let [tweetPostsDataset, setTweetPostsDataset] = useState([]);
    // let [userPostsDataset, setUserPostsDataset] = useState([])
    let [showCreatePost, setShowCreatePost] = useState(true);
    let [showPostsUntilIndex, setShowPostsUntilIndex] = useState(11);

    let appCtx = useContext(AppContexts);

    let location = useLocation()

    let handleDataset = result => {
        console.log(result, "result!!", ...result?.data?.data, "<><>", tweetPostsDataset)

        result?.data?.data && setTweetPostsDataset(prev => {
            let findIdx = prev.findIndex(item => result.data.data.findIndex(elem => elem.postData.id === item.postData.id))
            console.log(findIdx, "findIdx!!")
            // return ([...prev, ...result.data.data])
            return (findIdx === -1 ? [...prev, ...result.data.data] : [...prev])
        })
    }

    let handleAllAccessiblePosts = result => appCtx.handleAvailablePostsFeeds(result.data.data)

    let topics = appCtx?.user?.topics;

    useEffect(() => {
        if (appCtx?.user?.friends?.length !== -1) {

            topics?.forEach(topic => {
                let url = `${appCtx.baseUrl}/twitter/search/${topic}/${topic}`
                // readDataFromServer(url, handleDataset)
            })
        }
    }, [topics])

    // let getAllUserPosts = () => {
    //     let url = `${appCtx.baseUrl}/posts/${appCtx.user._id}`
    //     readDataFromServer(url, handleUserPostsDataset)
    // }

    let getAllAccessiblePosts = () => {
        let url = `${appCtx.baseUrl}/posts/`
        readDataFromServer(url, handleAllAccessiblePosts)
    }

    useEffect(() => {
        // appCtx.user._id && getAllUserPosts()
        // appCtx.user._id && getAllAccessiblePosts()
        location.pathname && appCtx?.user?._id && getAllAccessiblePosts()
        location.pathname && console.log(location.pathname === "/", location.pathname)
    }, [appCtx.user?._id, location.pathname])

    // making sure each time route changes existing posts gets removed so that state variable changes dont become unstable
    useEffect(() => appCtx.handleAvailablePostsFeeds([]), [location.pathname])

    // console.log(userPostsDataset, "postsDataset!!", allAccessiblePosts)
    // console.log("postsDataset!!", allAccessiblePosts)

    let renderTweetPosts = () => tweetPostsDataset?.map(dataset => <RenderPost key={dataset?.postData._id} item={dataset} baseUrl={appCtx.baseUrl} />)

    // let renderAllAccessiblePosts = () => appCtx.availablePostsFeeds?.sort((a, b) => new Date(a.created) < new Date(b.created) ? 1 : -1).map((dataset, idx) => (idx < 11) && <ShowUserCreatedPost key={dataset._id} postData={dataset} setShowCreatePost={setShowCreatePost} />)

    let renderAllAccessiblePosts = () => appCtx.availablePostsFeeds?.sort((a, b) => new Date(a.created) < new Date(b.created) ? 1 : -1).map((dataset, idx) => (idx < showPostsUntilIndex) && <ShowUserCreatedPost key={dataset._id} postData={dataset} setShowCreatePost={setShowCreatePost} />)

    // let renderUserPosts = () => userPostsDataset?.sort((a, b) => new Date(a.created) < new Date(b.created) ? 1 : -1).map(dataset => <ShowUserCreatedPost key={dataset._id} postData={dataset} />)

    let handleShowMore = () => {
        setShowPostsUntilIndex(prev => prev + 10 > appCtx.availablePostsFeeds.length ? appCtx.availablePostsFeeds.length : prev + 10)
    }

    console.log(showPostsUntilIndex, "untilIndex", appCtx.availablePostsFeeds.length)

    return (
        <Paper>
            <Typography variant='h1' id="top-marker">User Specific News Feeds</Typography>

            {showCreatePost ? <CreatePost /> : null}
            {/* <CreatePost setPostsDataset={setUserPostsDataset} /> */}
            {/* {renderUserPosts()} */}
            {/* {renderAllAccessiblePosts()} */}
            {appCtx.availablePostsFeeds.length ? renderAllAccessiblePosts() : null}

            <TweetEmbed tweetsDataset={tweetPostsDataset} />

            <Typography
                onClick={handleShowMore}
                variant="h4"
                sx={{
                    backgroundColor: 'primary.main',
                    color: "floralwhite",
                    '&:hover': {
                        backgroundColor: "lightsky",
                        color: 'text.secondary',
                        opacity: [0.9, 0.8, 0.7],
                        cursor: "pointer"
                    },
                }}
            >
                Show More
            </Typography>
            {/* {renderTweetPosts()} */}
            <ScrollToTop {...props}>
                <Fab size="small" aria-label="scroll back to top">
                    <KeyboardArrowUp />
                </Fab>
            </ScrollToTop>
        </Paper>
    )
}

const TweetEmbed = ({ tweetsDataset }) => {
    let renderEmbeds = () => tweetsDataset?.map(tweetDataset => <TwitterTweetEmbed key={tweetDataset?.postData?.id} tweetId={tweetDataset?.postData?.id} onLoad={function noRefCheck() { }} placeholder="Loading" />)
    return (
        <Paper
            className='embeds-wrap'
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}
        >
            {renderEmbeds()}
        </Paper>
    )
}

export default UserSpecificNewsFeeds