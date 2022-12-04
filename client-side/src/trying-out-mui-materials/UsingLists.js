import { Avatar, Box, Collapse, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Switch, Typography } from '@mui/material'
import { Inbox, Drafts, Send, ExpandLess, ExpandMore, StarBorder, Image, Work, BeachAccess, Wifi, Bluetooth } from "@mui/icons-material"
import React, { useState } from 'react'
import {FixedSizeList} from "react-window"

function UsingLists() {
    let [open, setOpen] = useState(true)
    let [selectedIndex, setSelectedIndex] = useState(1)
    let [checked, setChecked] = useState("wifi")
    
    let handleClick = () => setOpen(!open)
    
    let handleListItemClick = (event, index) => setSelectedIndex(index)

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    
    let renderRow = (props) => {
        const {index, style} = props
        return (
            <ListItem style={style} key={index} component="div" disablePadding>
                <ListItemButton>
                    <ListItemText primary={`Item ${index + 1}`} />
                </ListItemButton>
            </ListItem>
        )
    }

    return (
        <div>
            <Typography component={"h1"}>UsingLists</Typography>
            <>
                <Typography component={"h2"} sx={{ textAlign: "left" }}>Basic List</Typography>
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <nav aria-label="main mailbox folders">
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Inbox />
                                    </ListItemIcon>
                                    <ListItemText primary="Inbox" />
                                    <ListItemText secondary="unread" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Drafts />
                                    </ListItemIcon>
                                    <ListItemText primary="Drafts" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </nav>
                    <Divider />
                    <nav aria-label="secondary mailbox folders">
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemText primary="Trash" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component="a" href="#simple-list">
                                    <ListItemText primary="Spam" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </nav>
                </Box>
            </>

            <>
                <Typography component={"h2"}>NestedList</Typography>
                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    ria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Nested List Items
                        </ListSubheader>
                    }
                >
                    <ListItemButton>
                        <ListItemIcon>
                            <Send />
                        </ListItemIcon>
                        <ListItemText primary="Sent mail" />
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemIcon>
                            <Drafts />
                        </ListItemIcon>
                        <ListItemText primary="Drafts" />
                    </ListItemButton>
                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            <Inbox />
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Starred" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
            </>

            <>
                <Typography component={"h2"}>Folder Lists</Typography>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <Image />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Photos" secondary="Jan 9, 2014" />
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <Work />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Work" secondary="Jan 7, 2014" />
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <BeachAccess />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Vacation" secondary="July 20, 2014" />
                    </ListItem>
                </List>
            </>

            <>
                <Typography component={"h1"}>Selected ListItem</Typography>
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItemButton
                            selected={selectedIndex === 0}
                            onClick={e => (handleListItemClick(e, 0))}
                        >
                            <ListItemIcon>
                                <Inbox />
                            </ListItemIcon>
                            <ListItemText primary="Inbox" />
                        </ListItemButton>
                        <ListItemButton
                            selected={selectedIndex === 1}
                            onClick={(event) => handleListItemClick(event, 1)}
                        >
                            <ListItemIcon>
                                <Drafts />
                            </ListItemIcon>
                            <ListItemText primary="Drafts" />
                        </ListItemButton>
                    </List>
                    <Divider />
                    <List component="nav" aria-label="secondary mailbox folder">
                        <ListItemButton
                            selected={selectedIndex === 2}
                            onClick={e => handleListItemClick(e, 2)}
                        >
                            <ListItemText primary="Trash" />
                        </ListItemButton>
                        <ListItemButton
                            selected={selectedIndex === 3}
                            onClick={(event) => handleListItemClick(event, 3)}
                        >
                            <ListItemText primary="Spam" />
                        </ListItemButton>
                    </List>
                </Box>
            </>

            <>
                <Typography>Switch List</Typography>
                {/* <Box sx={{bgcolor: "tomato"}}> */}
                    <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'tomato' }}
                        subheader={<ListSubheader>Settings</ListSubheader>}
                    >
                        <ListItem>
                            <ListItemIcon>
                                <Wifi />
                            </ListItemIcon>
                            <ListItemText id="switch-list-label-wifi" primary="Wi-Fi" />
                            <Switch
                                edge="end"
                                onChange={handleToggle('wifi')}
                                checked={checked.indexOf('wifi') !== -1}
                                inputProps={{
                                    'aria-labelledby': 'switch-list-label-wifi',
                                }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <Bluetooth />
                            </ListItemIcon>
                            <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
                            <Switch
                                edge="end"
                                onChange={handleToggle('bluetooth')}
                                checked={checked.indexOf('bluetooth') !== -1}
                                inputProps={{
                                    'aria-labelledby': 'switch-list-label-bluetooth',
                                }}
                            />
                        </ListItem>
                    </List>
                {/* </Box> */}
            </>

            <>
            <Typography component={"h2"}>Virtualized List</Typography>
            <Box
                sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
            >
                <FixedSizeList 
                    height={400}
                    width={360}
                    itemSize={46}
                    itemCount={200}
                    overscanCount={5}
                >
                    {renderRow}
                </FixedSizeList>
            </Box>
            </>
        </div>
    )
}

export default UsingLists