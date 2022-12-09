import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AppBar, Box, Container, Paper, Tab, Tabs, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { AppContexts } from '../../App';
import useToFetchUserActionSpecificPostData from '../hooks/useToFetchData';
import ShowUserCreatedPost from '../UserCreatedPost';
import UserProfileInfoSection from '../UserProfileInfoSection'
import { readDataFromServer } from '../utils';

function UserProfile() {
    // let params = useParams()
    // console.log(params.userID, params, "paRAMS!!")
    let appCtx = useContext(AppContexts);

    return (
        <Paper>
            {/* <UserProfileInfoSection userId={params.userID} appCtx={appCtx} /> */}
            <UserProfileInfoSection appCtx={appCtx} />
            <Typography variant="h2">User Profile</Typography>
            <UserProfileTabs />
            {/* seems like visting another user profile could use a different route to differentiate between current visiting user profiles */}
            {/* {
                params.userID
                ? <RenderAllPostsTab appCtx={appCtx} />
                : <UserProfileTabs appCtx={appCtx} />
            } */}
        </Paper>
    )
}

let UserProfileTabs = () => {
    let [tabValue, setTabValue] = useState("1");

    let handleTabValueChange = (event, current) => {
        // console.log(current, "current!!")
        setTabValue(current);
    }

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                        onChange={handleTabValueChange}
                        aria-label="lab API tabs example"
                        variant='fullWidth'
                        indicatorColor="secondary"
                    >
                        <Tab label="All Posts" value="1" />
                        <Tab label="Liked Posts" value="2" />
                        <Tab label="Loved Posts" value="3" />
                        <Tab label="Shared Posts" value="4" />
                        <Tab label="Commented Posts" value="5" />
                        <Tab label="Disliked Posts" value="6" />
                    </TabList>
                </Box>
                <TabPanel value="1"><RenderAllPostsTab /></TabPanel>
                <TabPanel value="2"><RenderActionSpecificPosts actionType={"Like"} /></TabPanel>
                <TabPanel value="3"><RenderActionSpecificPosts actionType={"Love"} /></TabPanel>
                <TabPanel value="4"><RenderActionSpecificPosts actionType={"Share"} /></TabPanel>
                <TabPanel value="5"><RenderActionSpecificPosts actionType={"Comment"} /></TabPanel>
                <TabPanel value="6"><RenderActionSpecificPosts actionType={"Dislike"} /></TabPanel>
            </TabContext>
        </Box>
    )
}

export let RenderAllPostsTab = () => {
    let [postsData, setPostsData] = useState([]);

    let appCtx = useContext(AppContexts);

    let params = useParams()
    // console.log(params.userID, params, "paRAMS!!")

    let handlePostsData = (result) => {
        // console.log(result.data.data, result, "!!")
        setPostsData(result.data.data)
    }

    let getAllPostsForThisUser = () => {
        // let url = `${appCtx.baseUrl}/posts/${appCtx.user._id}`
        let url = `${appCtx.baseUrl}/posts/${params.userID ? params.userID : appCtx.user._id}`
        readDataFromServer(url, handlePostsData)
    }

    useEffect(() => {
        getAllPostsForThisUser()
    }, [])

    // let renderAllAccessiblePosts = () => postsData?.sort((a, b) => new Date(a.created) < new Date(b.created) ? 1 : -1).map((dataset, idx) => (idx < showPostsUntilIndex) && <ShowUserCreatedPost key={dataset._id} postData={dataset} setShowCreatePost={setShowCreatePost} />)
    let renderAllPosts = () => postsData?.sort((a, b) => new Date(a.created) < new Date(b.created) ? 1 : -1).map((dataset, idx) => (idx < 11) && <ShowUserCreatedPost key={dataset._id} postData={dataset} setShowCreatePost={() => null} />)

    return (
        <Paper>
            <Typography variant="h3">All Posts!!</Typography>
            <Container>
                {postsData?.length ? renderAllPosts() : null}
            </Container>
        </Paper>
    )
}

let RenderActionSpecificPosts = ({actionType}) => {
    let appCtx = useContext(AppContexts);

    let { postsData } = useToFetchUserActionSpecificPostData(appCtx, actionType)

    console.log(postsData, "data!!")

    let renderAllPosts = () => postsData?.sort((a, b) => new Date(a.created) < new Date(b.created) ? 1 : -1).map((dataset, idx) => (idx < 11) && <ShowUserCreatedPost key={dataset._id} postData={dataset} setShowCreatePost={() => null} />)

    return (
        <Paper>
            <Typography variant="h3">{actionType}d Posts!!</Typography>
            <Container>
                {postsData?.length ? renderAllPosts() : null}
            </Container>
        </Paper>
    )
}

export default UserProfile