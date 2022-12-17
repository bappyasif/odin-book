import { Alert, AlertTitle, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItem, ListItemText, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useToCloseModalOnClickedOutside } from './hooks/toDetectClickOutside';

export function HowToUseApp() {
    return (
        <div>HowToUseApp</div>
    )
}

export const HowToUseCreatePostComponent = () => {
    let [showDialog, setShowDialog] = useState(false);

    const ref = useRef();

    const handleOpenShowDialog = () => setShowDialog(true)

    const handleCloseShowDialog = () => setShowDialog(false)

    useToCloseModalOnClickedOutside(ref, handleCloseShowDialog)

    const titleText = 'Things you can do with Create post!!'

    const actions = [
        { name: "Editor", descriptions: ["This is a Rich Text Editor(tinymce). You can use this editor to have your post text look much more presentable than just plan text", "You can use this to add code or emoticon within your post", "You can also see current word/character counts from toolbar or at bottom right corner of editor", "Feel free to play with other available tools from this editor to make your posts standout nicely"] },
        { name: "Image", descriptions: ["You can add a picture from web to include this in your post", "Currently you can Only use any valid Image Url to do so", "No file upload is currently available"] },
        { name: "Video", descriptions: ["You can add a video from web to include this in your post", "Currently you can Only use any valid Video Url to do so", "No file upload is currently available"] },
        { name: "Gif", descriptions: ["When you click on it a List of most trending Gifs will show up", "You can choose one of them in your post as well", "Currently only one Gif resource per post is available"] },
        { name: "Poll", descriptions: ["When clicked on it a Poll creating view will show up", "You can ask a question to your audience via this", "Your can add choices for your audience to choose from and cast their votes on"] },
        { name: "Privacy", descriptions: ["When clicked upon a Privacy selecting choices will dropdown will show up", "You can make your posts private and only visible to your friends by selecting option Friends", "By default Privacy is Everyone, if you dont change it"] },
        { name: "Create", descriptions: ["When you're ready with your post hit this button to post it on OdBo", "When you create a post this will show up in your profile and also in your news feeds page, a.k.a page that you are currently on"] }
    ];

    let renderActions = () => actions.map(action => <RenderHowToUseInformations key={action.name} actionItem={action} />)

    console.log(titleText, "titleText", renderActions())

    useEffect(() => {
        handleOpenShowDialog();
    }, [])

    return (
        <Dialog
            ref={ref}
            onClose={handleCloseShowDialog}
            open={showDialog}
        >
            <RenderHowToUseInformationsTitleText text={titleText} />
            <DialogContent>
                {renderActions()}
            </DialogContent>
        </Dialog>
    )

}

const RenderHowToUseInformationsTitleText = ({ text }) => {
    return (
        <DialogTitle>{text}</DialogTitle>
    )
}

const RenderHowToUseInformations = ({ actionItem }) => {
    let { name, descriptions } = { ...actionItem }

    let renderDescriptions = () => descriptions.map((item, idx) => <RenderActionDescriptionDetail key={item + idx} text={item} />)

    return (
        <DialogContentText>
            <Typography>{name}</Typography>
            <ListItem>
                {renderDescriptions()}
            </ListItem>
        </DialogContentText>
    )
}

const RenderActionDescriptionDetail = ({ text }) => {
    return (
        <ListItemText>
            <Typography>{text}</Typography>
        </ListItemText>
    )
}

export const ButtonToIndicateHelp = ({ alertPosition }) => {
    let [showMoreInfo, setShowMoreInfo] = useState(false);
    const handleShowMoreInfo = () => setShowMoreInfo(true)
    const handleHideMoreInfo = () => setShowMoreInfo(false)
    return (
        <>
            <Alert
                onMouseEnter={handleShowMoreInfo}
                onMouseLeave={handleHideMoreInfo}
                sx={{
                    position: "absolute",
                    zIndex: 9,
                    backgroundColor: "rgba(255,255,255,.4)",
                    borderRadius: "50%",
                    padding: "2px",
                    fontSize: "2em",
                    pl: "15px",
                    opacity: .6,
                    outline: "solid .8px aqua",
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,.9)',
                        opacity: .9,
                    },
                    // ...alertPosition
                }}
                severity='info'
            />
            {showMoreInfo ? <MoreInfoOnHover /> : null}
        </>
    )
}

export const MoreInfoOnHover = ({ name }) => {
    return (
        <Button
            sx={{
                position: "absolute",
                left: 0,
                zIndex: 9,
                top: "35px",
                maxWidth: "200px"
            }}
        >
            <Alert severity='info'>
                <AlertTitle>How To Use Info</AlertTitle>
                <Typography variant='body2'>Click on this info icon to find out more about how to use it better</Typography>
            </Alert>
        </Button>
    )
}