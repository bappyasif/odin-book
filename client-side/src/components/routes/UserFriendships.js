import { AccountCircleTwoTone, HowToRegRounded, MoreVertTwoTone, PersonOffRounded, PersonOffTwoTone } from '@mui/icons-material';
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, Container, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Paper, Stack, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContexts } from '../../App'
import { readDataFromServer, updateDataInDatabase, updateUserInDatabase } from '../utils';
import { MutualFriends } from './ConnectUsers';

let UserFriendships = () => {
    return (
        <>
            <Typography>User Friendships</Typography>
            <Stack
                sx={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 9
                }}
            >
                <ExistingFriendList />
                <FriendsRequests />
            </Stack>
        </>
    )
}

let ExistingFriendList = () => {
    let [friends, setFriends] = useState([])

    let appCtx = useContext(AppContexts);

    let handleAllFriendsData = (value) => setFriends(prev => [...prev, value])

    let renderFriends = () => appCtx.user.friends.map(frnd => <RenderFriend key={frnd} friendID={frnd} handleAllFriendsData={handleAllFriendsData} baseUrl={appCtx.baseUrl} />)

    return (
        <Paper sx={{ backgroundColor: "lightsteelblue" }}>
            <Typography variant="h4">Friend Listings:</Typography>
            {renderFriends()}
            {
                appCtx.user.friends.length === 0
                    ?
                    <Typography
                        variant="h6"
                        sx={{ outline: "solid .6px darkred", borderRadius: 2, mt: 4, p: 1.1 }}
                    >
                        Friends list is empty, add some :)
                    </Typography>
                    : null
            }
        </Paper>
    )
}

let RenderFriend = ({ friendID, handleAllFriendsData, baseUrl }) => {
    let [data, setData] = useState();
    let [showActionOptions, setShowActionOptions] = useState(false);

    let toggleShowActionOptions = () => setShowActionOptions(!showActionOptions);

    let dataHandler = dataset => {
        setData(dataset.data.data)
        dataset.data.data && handleAllFriendsData(dataset.data.data)
    }

    let getFriendData = () => {
        let url = `${baseUrl}/users/${friendID}`
        readDataFromServer(url, dataHandler)
    }

    useEffect(() => {
        friendID && getFriendData()
    }, [])

    return (
        data?.fullName
            ?
            <Stack
                sx={{
                    outline: showActionOptions ? "none" : "solid .6px darkred",
                    borderRadius: 2
                }}
            >
                <Card
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        alignItems: "flex-start"
                    }}
                >
                    <FriendCardHeader data={data} toggleShowActionOptions={toggleShowActionOptions} />
                    <CardContent sx={{alignSelf: "center"}}>
                        <MutualFriends friends={data.friends} variantType="subtitle2" />
                    </CardContent>
                    <CardActions>
                        <IconButton
                            sx={{ position: "relative" }}
                            onClick={toggleShowActionOptions}
                        >
                            <MoreVertTwoTone />
                        </IconButton>
                    </CardActions>
                </Card>
                {/* <FriendCardHeader data={data} toggleShowActionOptions={toggleShowActionOptions} /> */}
                {/* <Divider orientation="vertical" /> */}
                {/* <MutualFriends friends={data.friends} /> */}
                {showActionOptions ? <ActionListOptions toggleShowActionOptions={toggleShowActionOptions} friendId={data._id} /> : null}
            </Stack>
            : null
    )
}

let FriendCardHeader = ({ data, toggleShowActionOptions }) => {

    let imgUrl = data.ppUrl || "https://random.imagecdn.app/76/56"

    return (
        <CardHeader
            sx={{ width: "20vw", position: "relative" }}
            avatar={
                <Avatar
                    src={imgUrl}
                    sx={{ width: "92px", height: "62px" }}
                />
            }
            // action={
            //     <IconButton
            //         sx={{ position: "relative" }}
            //         onClick={toggleShowActionOptions}
            //     >
            //         <MoreVertTwoTone />
            //     </IconButton>
            // }
            title={data.fullName}
            subheader={"Friend Since!!"}
        // subheader={<MutualFriends friends={data.friends} variantType="subtitle2" />}
        >
            {/* <Typography>MutualFriends</Typography> */}
        </CardHeader>
    )
}

let ActionListOptions = ({ toggleShowActionOptions, friendId }) => {
    let options = [{ name: "View Profile", icon: <AccountCircleTwoTone /> }, { name: "Remove From Friend List", icon: <PersonOffTwoTone /> }]

    let renderOptions = () => options.map(item => <RenderActionListOption key={item.name} item={item} toggleShowActionOptions={toggleShowActionOptions} friendId={friendId} />)

    return (
        <List
            sx={{
                alignSelf: "flex-end",
                position: "absolute",
                mt: 5.8,
                outline: "solid .6px darkred",
                borderRadius: 2,
                zIndex: 9
            }}
        >
            {renderOptions()}
        </List>
    )
}

let RenderActionListOption = ({ item, toggleShowActionOptions, friendId }) => {
    let appCtx = useContext(AppContexts)

    let navigate = useNavigate()

    let removeFromCurentUserStateVariable = () => appCtx.removeIdFromCurrentUserFriendsList(friendId)

    let removeFromFriendList = () => {
        let url = `${appCtx.baseUrl}/users/${appCtx.user._id}/remove`

        updateDataInDatabase(url, { friendId: friendId }, removeFromCurentUserStateVariable)
    }

    let visitUserProfile = () => {
        console.log("visit");
        navigate(`/users/${appCtx.user._id}/profile`)
    }

    let handleClick = () => {
        toggleShowActionOptions()
        if (item.name === "View Profile") {
            visitUserProfile()
        } else if (item.name.includes("Remove")) {
            removeFromFriendList()
        }
    }

    return (
        <ListItem
            sx={{
                mr: 4,
                pr: 1.1,
                backgroundColor: 'honeydew',
                '&:hover': {
                    color: "floralwhite",
                    backgroundColor: 'lightskyblue',
                },
            }}
            onClick={handleClick}
        >
            <ListItemAvatar>
                <Avatar>
                    {item.icon}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                // primary={<Typography variant="h5">Friend</Typography>}
                secondary={<Typography variant="h6">{item.name}</Typography>}
            />
        </ListItem>
    )
}

function FriendsRequests() {
    let appCtx = useContext(AppContexts);

    let renderFriendRequests = () => appCtx?.user?.frRecieved?.map(friendId => <ShowFriendRequest key={friendId} friendId={friendId} baseUrl={appCtx.baseUrl} />)

    return (
        <Paper sx={{ width: "29vw", backgroundColor: "lightsteelblue" }}>
            <Typography variant={'h4'}>Friend Requests</Typography>
            <Box
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
            >
                {renderFriendRequests()}
            </Box>
        </Paper>
    )
}

let ShowFriendRequest = ({ friendId, baseUrl }) => {
    let [data, setData] = useState({})

    let url = `${baseUrl}/users/${friendId}`

    let dataHandler = dataset => setData(dataset.data.data)

    useEffect(() => {
        readDataFromServer(url, dataHandler)
    }, [url])

    let renderListAssets = () => listAssets.map(elem => <RenderListIconElement key={elem.tooltip} elem={elem} friendId={friendId} />)

    return (
        <Stack sx={{ width: "100%", }}>
            <List sx={{ display: "flex", alignItems: "center", }}>

                <ListItem
                    sx={{ outline: "solid .6px red", borderRadius: 2, justifyContent: "space-around" }}
                >
                    <Avatar
                        alt='user profile picture'
                        src={data.ppUrl || 'https://random.imagecdn.app/76/56'}
                        sx={{ width: 76, height: 56 }}
                    />

                    <Typography sx={{ ml: 2, mr: 2 }} variant="h4">{data.fullName}</Typography>
                    <MutualFriends friends={data.friends} variantType="p" />
                    {renderListAssets()}
                </ListItem>
            </List>
        </Stack>
    )
}

let RenderListIconElement = ({ elem, friendId }) => {
    let appCtx = useContext(AppContexts);
    let navigate = useNavigate()

    let handleClick = evt => {
        let url = `${appCtx.baseUrl}/users/${appCtx.user._id}`;

        if (elem.tooltip === "Accept") {
            let data = { accept: friendId }
            updateUserInDatabase(`${url}/accept`, data, appCtx.acceptOrRejectFriendRequestUpdater, navigate, "user-friendships")

        } else if (elem.tooltip === "Reject") {
            let data = { reject: friendId }
            updateUserInDatabase(`${url}/reject`, data, appCtx.acceptOrRejectFriendRequestUpdater, navigate, "user-friendships")
        }
    }

    return (
        <ListItemIcon>
            <Tooltip title={elem.tooltip} sx={{ p: 0 }} >
                <IconButton
                    onClick={handleClick}
                    sx={{ backgroundColor: 'primary.dark' }}
                >
                    {elem.icon}
                </IconButton>
            </Tooltip>
        </ListItemIcon>
    )
}

let listAssets = [
    {
        tooltip: "Accept",
        icon: <HowToRegRounded />
    },
    {
        tooltip: "Reject",
        icon: <PersonOffRounded />
    }
]

export default UserFriendships