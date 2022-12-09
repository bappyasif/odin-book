import { MoreVertTwoTone } from '@mui/icons-material'
import { Avatar, Card, CardContent, CardHeader, IconButton, Tooltip, Typography } from '@mui/material'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppContexts } from '../App'
import { CardHeaderElement } from './MuiElements'
import ShowUserPostMedias from './ShowUserPostMedias'
import { readDataFromServer } from './utils'

function RenderPostDataEssentials({ postData, shareMode }) {
    let { body, created, gif, poll, privacy, imageUrl, videoUrl, _id } = { ...postData }

    let [userData, setUserData] = useState({})

    const appCtx = useContext(AppContexts)

    let handleUserData = (result) => setUserData(result.data.data)

    let getDataAboutThisPostUser = () => {
        let url = `${appCtx.baseUrl}/users/${postData.userId}`
        readDataFromServer(url, handleUserData)
    }

    useEffect(() => {
        postData.userId && getDataAboutThisPostUser()
    }, [])

    let preparingAdditionalsForRendering = {
        Id: _id,
        Image: imageUrl,
        Video: videoUrl,
        Gif: gif[0],
        Poll: poll[0],
        Privacy: privacy
    }

    return (
        <>
            {/* <Link id='posted-by' style={{ textDecoration: "none" }} to={`/users/${userData._id}/visit/profile`}> */}
            {/* <p className='tooltip-text'>Visit Profile</p> */}
            {/* <CardHeaderElement
                    avatarUrl={userData?.ppUrl || "https://random.imagecdn.app/500/150"}
                    altText={"fullname"}
                    title={userData?.fullName || "User Name"}
                    joined={userData?.created || Date.now()}
                    forPost={true}
                /> */}
            {/* </Link> */}

            {/* <p className='posted-by-tooltip-text'>Visit Profile</p> */}

            {/* <Typography variant='h4' sx={{ backgroundColor: "honeydew", p: .2, mr: 6, ml: 15 }} dangerouslySetInnerHTML={{ __html: body }}></Typography> */}

            {/* {preparingAdditionalsForRendering.Id ? <ShowUserPostMedias mediaContents={preparingAdditionalsForRendering} /> : null} */}

            <Card>
                <RenderPostCardHeader userData={userData} />

                {shareMode ? null : <Typography sx={{ color: "text.secondary", position: "absolute", top: 29, right: 20 }} variant="subtitle2">{`Live Since: ${moment(created).fromNow()}`}</Typography>}

                <RenderPostCardContent body={body} preparingAdditionalsForRendering={preparingAdditionalsForRendering} />
            </Card>
        </>
    )
}

const RenderPostCardContent = ({ body, preparingAdditionalsForRendering }) => {
    return (
        <CardContent>
            <Typography variant='h4' sx={{ backgroundColor: "honeydew", p: .2, mr: 6, ml: 15 }} dangerouslySetInnerHTML={{ __html: body }}></Typography>
            <ShowUserPostMedias mediaContents={preparingAdditionalsForRendering} />
        </CardContent>
    )
}

const RenderPostCardHeader = ({ userData }) => {
    let appCtx = useContext(AppContexts);

    return (
        <CardHeader
            avatar={
                <Link className='posted-by' style={{ textDecoration: "none" }} to={ appCtx.user._id ? `/users/${userData._id}/visit/profile` : '/'}>
                    <Avatar
                        src={userData?.ppUrl || "https://random.imagecdn.app/500/150"}
                        sx={{ bgcolor: "red[500]", width: "74px", height: "74px" }}
                        aria-label="recipe"
                        alt={`User ${userData.fullName || ''} profile display`}
                    />
                    <p className='posted-by-tooltip-text'>{appCtx.user._id ? "Visit Profile" : "Login To Visit Profile"}</p>
                </Link>
            }
            // action={
            //     <IconButton aria-label="settings">
            //         <MoreVertTwoTone />
            //     </IconButton>
            // }
            title={
                <Link className='posted-by' style={{ textDecoration: "none" }} to={ appCtx.user._id ? `/users/${userData._id}/visit/profile` : '/'}>
                    <Typography variant="h4">{userData.fullName || "User Name"}</Typography>
                    <p className='posted-by-tooltip-text'>{appCtx.user._id ? "Visit Profile" : "Login To Visit Profile"}</p>
                </Link>
            }
            subheader={
                <Typography variant="subtitle2">{`Member Since: ${moment(userData.created).fromNow()}`}</Typography>
            }
        />
    )
}

export default RenderPostDataEssentials