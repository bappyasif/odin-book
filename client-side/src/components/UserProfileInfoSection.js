import { Edit, Navigation, WallpaperRounded } from '@mui/icons-material'
import { Box, Button, Container, Divider, Fab, IconButton, ImageList, ImageListItem, ImageListItemBar, Paper, Stack, TextField, Typography } from '@mui/material'
import moment from 'moment'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import { AppContexts } from "../App"
import { checkIfItHasJpgExtension } from './routes/EditUserProfile'
import { updateDataInDatabase } from './utils'

function UserProfileInfoSection({ appCtx }) {
    return (
        <Box sx={{ mb: 2 }}>
            {/* <CoverPhoto userData={appCtx.user} /> */}
            <RenderUserProfilePhoto userData={appCtx.user} fromPP={false} />
            <Box
                sx={{ minWidth: "920px", maxWidth: "fit-content", margin: "auto", bgcolor: "gainsboro", pl: 2, pt: .4, pr: 2, pb: .1, borderRadius: 2 }}
            >
                <UserNameAndInfo userData={appCtx.user} />
                <Divider variant="fullWidth" sx={{mt: 1.1}} />
                <SomeUserSpecificInfo userData={appCtx.user} />
                <UserFriendsAndInfo userData={appCtx.user} />
            </Box>
        </Box>
    )
}

let RenderUserProfilePhoto = ({ userData, fromPP }) => {
    let { ppUrl, cpUrl, fullName } = { ...userData }

    let [showModal, setShowModal] = useState(false);

    let toggleShowModal = () => setShowModal(!showModal);

    let closeShowModal = () => setShowModal(false);

    let decideImgResourceUrl = () => {
        let src = "";

        if (fromPP && ppUrl) {
            src = checkIfItHasJpgExtension(ppUrl) ? ppUrl : `${ppUrl}?w85&h95&fit=crop&auto=format`
        } else if (fromPP && !ppUrl) {
            src = `${fakeDataModel[0].coverPhotoUrl}?w85&h95&fit=crop&auto=format`
        } else if (!fromPP && cpUrl) {
            src = checkIfItHasJpgExtension(cpUrl) ? cpUrl : `${cpUrl}?w85&h95&fit=crop&auto=format`
        } else if (!fromPP && !cpUrl) {
            src = `${fakeDataModel[0].coverPhotoUrl}?w85&h95&fit=crop&auto=format`
        }

        return src;
    }

    return (
        <Stack
            sx={{
                flexDirection: "column",
                position: "relative",
            }}
        >
            <ImageListItem>
                <img
                    // src={`${ppUrl ? ppUrl : fakeDataModel[0].coverPhotoUrl}?w85&h95&fit=crop&auto=format`}
                    // srcSet={`${ppUrl ? ppUrl : fakeDataModel[0].coverPhotoUrl}?w85&h95&fit=crop&auto=format&dpr= 2 2x`}
                    src={decideImgResourceUrl()}
                    srcSet={`${decideImgResourceUrl()}&dpr= 2 2x`}
                    alt={`user ${fullName ? fullName : "X"} profile display`}
                    loading='lazy'
                />
                <ImageListItemBar
                    sx={{
                        justifyContent: "center",
                    }}

                    title={<Typography variant="h6">{fromPP ? "Profile" : "Cover"} Photo</Typography>}

                    onClick={toggleShowModal}

                    actionIcon={
                        <IconButton
                        >
                            <WallpaperRounded
                                sx={{ color: "floralwhite" }}
                            />
                        </IconButton>
                    }
                />
            </ImageListItem>

            {showModal ? <ShowUrlGrabbingModal closeModal={closeShowModal} fromPP={fromPP} /> : null}
        </Stack>
    )
}

let ShowUrlGrabbingModal = ({ closeModal, fromPP }) => {
    let [urlText, setUrlText] = useState(null);

    let appCtx = useContext(AppContexts);

    let url = `${appCtx.baseUrl}/users/${appCtx.user._id}/profile`

    let afterUpdateIsSuccessfull = () => {
        appCtx.updateUserProfileDataInApp(fromPP ? "ppUrl" : "cpUrl", urlText);
        closeModal()
    }

    let handlPhotoUrlUpload = () => {
        let data = { [fromPP ? "ppUrl" : "cpUrl"]: urlText }
        console.log(data, "data!!", url)
        updateDataInDatabase(url, data, afterUpdateIsSuccessfull)
        // updateDataInDatabase(url, data, closeModal)
        // closeModal();
    }
    let handleClick = () => {
        console.log("Clicked!!")
        // closeModal();
        if (urlText) {
            handlPhotoUrlUpload();
        } else {
            alert("Enter A Valid Url!!")
        }
    }

    let handleUrlInput = (evt) => setUrlText(evt.target.value)

    return (
        <Paper
            sx={{
                position: "absolute",
                p: 2,
                pl: .4,
                pr: .4,
                backgroundColor: "honeydew",
                borderRadius: 2,
                left: fromPP ? "29%" : "38.7%",
                bottom: fromPP ? "12.1%" : "0%"
            }}
        >
            <Container
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column"
                }}
            >
                <TextField onChange={handleUrlInput} fullWidth={true} id='outline-basic' label={`Enter Your New ${fromPP ? "Profile Photo" : "Cover Image"} Url`} variant={"outlined"} color="secondary" />
                <Stack
                    sx={{
                        flexDirection: "row",
                        gap: 2,
                        mt: 1.3
                    }}
                >
                    <Button onClick={handleClick} size="large" variant="contained" color="success">Update Photo</Button>
                    <Button onClick={closeModal} size="large" variant="contained" color="secondary">Keep Existing</Button>
                </Stack>
            </Container>
        </Paper>
    )
}

let SomeUserSpecificInfo = ({ userData }) => {
    let { bio, created, webLink } = { ...userData }

    let innerStackStyles = { flexDirection: "row", gap: "35px", alignItems: "baseline" }

    let items = [{ name: "Bio", value: bio || fakeDataModel[0].bio }]

    let renderBio = () => items.map(item => <RenderUserProfileData key={item.name} item={item} styles={innerStackStyles} />)

    let otherItems = [{ name: "Joined", value: moment(created ? created : fakeDataModel[0].created).format("MM-DD-YYYY") }, { name: "Website", value: webLink ? webLink : fakeDataModel[0].weblink }]

    let renderOtherItems = () => otherItems.map(item => <RenderUserProfileData key={item.name} item={item} styles={innerStackStyles} />)

    return (
        <Stack sx={{ textAlign: "justify", mt: 2 }}>
            {renderBio()}

            <Stack sx={{ flexDirection: "row", justifyContent: "space-between", mt: 2 }}>
                {renderOtherItems()}
            </Stack>
        </Stack>
    )
}

let UserFriendsAndInfo = ({ userData }) => {
    let { friends, frSent, frRecieved } = { ...userData }

    let innerStackStyles = { flexDirection: "row", gap: "35px", alignItems: "baseline" }

    let items = [{ name: "Friends count", value: friends.length || fakeDataModel[0].friends }, { name: "Friend Requests Recieved", value: frRecieved.length || fakeDataModel[0].frRcvd }, { name: "Friend Requests Sent", value: frSent.length || fakeDataModel[0].frSent }]

    let renderItems = () => items.map(item => <RenderUserProfileData key={item.name} item={item} styles={innerStackStyles} />)

    return (
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between", mt: 2, mb: 2 }}>
            {renderItems()}
        </Stack>
    )
}

let UserNameAndInfo = ({ userData }) => {
    let { ppUrl, fullName, email } = { ...userData }

    let navigate = useNavigate();

    let styles = {
        flexDirection: "row",
        gap: 2,
        mt: .6,
        alignItems: "baseline",
        justifyContent: "space-between"
    }

    let items = [{ name: "FullName", value: fullName || fakeDataModel[0].fullName }, { name: "Email", value: email || fakeDataModel[0].email }]

    let renderItems = () => items.map(item => <RenderUserProfileData key={item.name} item={item} styles={styles} />)

    let handleClick = () => {
        navigate("/edit-user-profile")
    }

    return (
        <Stack
            sx={{ flexDirection: "column", gap: .6, mt: .6 }}
        >
            {/* <ProfilePhoto ppUrl={ppUrl} fullName={fullName} /> */}
            <RenderUserProfilePhoto userData={userData} fromPP={true} />
            <Stack
                sx={{
                    flexDirection: "row",
                    gap: 6,
                    mt: .6,
                    alignItems: "baseline",
                    justifyContent: "space-around"
                }}
            >
                {renderItems()}
                <Fab onClick={handleClick} variant="extended" color="primary" aria-label="add">
                    <Edit sx={{ mr: 1 }} />
                    Edit Info
                </Fab>
            </Stack>
        </Stack>
    )
}

let RenderUserProfileData = ({ item, styles }) => {
    let assignNameVariant = () => (item.name === "Email" || item.name === "FullName") ? "h5" : "h6"
    
    let assignValueVariant = () => (item.name === "Email" || item.name === "FullName") ? "h4" : "h6"
    
    return (
        <Stack
            sx={styles}
        >
            <Typography variant={assignNameVariant()}>{item.name}: </Typography>
            <Typography variant={assignValueVariant()}>{item.value}</Typography>
        </Stack>
    )
}

export let fakeDataModel = [
    {
        fullName: "FULL NAME",
        email: "email@ail.vod",
        friends: 4,
        frSent: 4,
        frRcvd: 4,
        coverPhotoUrl: "https://picsum.photos/500/150",
        profilePhotoUrl: "https://picsum.photos/85/95",
        // coverPhotoUrl: "https://random.imagecdn.app/500/150",
        // profilePhotoUrl: "https://random.imagecdn.app/85/95",
        // coverPhotoUrl: "https://source.unsplash.com/random/150x150?sig=1",
        // profilePhotoUrl: "https://source.unsplash.com/random/85x95?sig=1",
        bio: "loremipsum",
        weblink: "https://www.twitter.com/axby",
        created: new Date().toISOString(),
    }
]

export default UserProfileInfoSection