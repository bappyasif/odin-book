import { Box, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContexts } from '../../App'
import { WrapperDiv } from '../GeneralElements'
import { ButtonToIndicateHelp, HowToUseConnectUsersListings } from '../HowToUseApp'
import { BoxElement, ButtonElement, CardContentElement, CardElement, CardHeaderElement, MasonryElement, SkeletonBasicElement, StackElement, TypographyElement } from '../MuiElements'
import { readDataFromServer, updateUserInDatabase } from '../utils'

function ConnectUsers() {
  let [data, setData] = useState({})
  let [timers, setTimers] = useState(false)

  let appCtx = useContext(AppContexts)

  let url = `${appCtx.baseUrl}/users`

  let dataHandler = dataset => setData(dataset)

  useEffect(() => {
    readDataFromServer(url, dataHandler)
  }, [url])

  // making timers flag to be true after 1.7sec
  let timer = setTimeout(() => setTimers(true), 1700)

  // when flag is true then we are clearing its timer for performance and best practice, also turning timers flag to false
  useEffect(() => {
    timers && clearTimeout(timer)
    timers && setTimers(false);
  }, [])

  let renderUsers = () => data?.data?.data.map(user => appCtx.user._id.toString() !== user._id && <RenderUser key={user._id} userData={user} />)

  return (
    <WrapperDiv className="cards-wrapper">
      <TypographyElement text={"Connect With Other User"} type="h1" />

      {/* making skeleton show up when data is still not available */}
      {!timers && Array.from([1, 2, 3, 4]).map(idx => <CardSkeleton key={idx} />)}

      {
        timers
          ?
          <MasonryElement className="masonry-elem">
            {renderUsers()}
          </MasonryElement>
          :
          null
      }
    </WrapperDiv>
  )
}

let RenderUser = ({ userData }) => {
  let { fullName, email, friends, created, bio, _id, ppUrl } = { ...userData }
  let test = "https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg"

  let appCtx = useContext(AppContexts);

  let navigate = useNavigate()

  let updatingUserDataInDatabase = (data, endpoint) => {
    let url = `${appCtx.baseUrl}/users/${endpoint}`
    updateUserInDatabase(url, data, appCtx.updateData, navigate, "connect")
  }

  let handleSend = (evt) => {
    // both "send" and "undo" will perform these operations
    // when sending, data will be added and when undoing existing data will be removed
    updatingUserDataInDatabase({ frSent: userData._id }, appCtx.user._id)
    updatingUserDataInDatabase({ frRecieved: appCtx.user._id }, userData._id)
  }

  // console.log(appCtx.user.frSent.includes(_id) || appCtx.user.friends.includes(_id), appCtx.user.frSent.includes(_id), appCtx.user.friends.includes(_id))

  return (
    <CardElement
      className="card-wrapper"
      styles={{ backgroundColor: "text.secondary", position: "relative" }}
    >
      <ButtonToIndicateHelp alertPosition={{left: "13px", top: 0}} forWhichItem={"Connect Users Listings"} />
      {/* <ButtonToIndicateHelp forWhichItem={"Connect Users Listings"} /> */}
      {appCtx.dialogTextFor === "Connect Users Listings" ? <HowToUseConnectUsersListings /> : null}

      <CardHeaderElement avatarUrl={ppUrl || test} altText={fullName} title={fullName} joined={created} forConnect={true} />
      <CardContentElement>
        <TypographyElement
          text={appCtx.user.friends.includes(_id) ? email : "Email: be a friend to see that"}
          type={"p"}
          forConnect={true}
          styles={{ mb: 2 }}
        />
        <TypographyElement
          text={bio ? bio : "This user has yet to write a bio"}
          type={"h6"}
          forConnect={true}
          styles={{ textAlign: "justify", backgroundColor: "lightyellow", p: 1.1, borderRadius: 1.1 }}
        />
        <StackElement className="af-wrapper">
          <MutualFriends friends={friends} />
          <BoxElement className="fc">
            <TypographyElement text={"Friends: "} type={"h5"} />
            <TypographyElement text={friends.length} type={"h5"} />
          </BoxElement>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, flexDirection: "column" }}>
            <TypographyElement
              text={appCtx.user.friends.includes(_id) ? "Friend Already" : "Friend Request"}
              type={"h5"} />
            <BoxElement className="all-btns">
              <ButtonElement
                text={appCtx.user.frSent.includes(_id) ? "Sent" : "Send"}
                type="contained"
                action={handleSend}
                disable={appCtx.user.frSent.includes(_id) || appCtx.user.friends.includes(_id)}
              />
              <ButtonElement
                text={"Undo"}
                type="contained"
                action={handleSend}
                disable={!appCtx.user.frSent.includes(_id) || appCtx.user.friends.includes(_id)}
              />
            </BoxElement>
          </Box>
        </StackElement>
      </CardContentElement>
    </CardElement>
  )
}

export const MutualFriends = ({ friends, variantType, forProfile }) => {
  let [mutualFriends, setMutualFriends] = useState([])

  let appCtx = useContext(AppContexts);

  const updateMutualFriendsCounts = () => {
    friends.forEach(frndId => {
      let findIdx = appCtx.user.friends.findIndex(val => val === frndId)
      if (findIdx !== -1) {
        setMutualFriends(prev => {
          let checkDuplicate = prev.findIndex(val => val === frndId)
          return checkDuplicate === -1 ? [...prev, frndId] : prev
        })
      }
    })
  }

  const lookForMutualFriends = () => {
    if (friends?.length) {
      updateMutualFriendsCounts()
    }
  }

  // mutualFriends.length && console.table("mutual", mutualFriends, "frnds", friends, "user friends", appCtx.user.friends)

  useEffect(() => {
    friends?.length && lookForMutualFriends()
  }, [])

  return (
    <Stack
      sx={{
        flexDirection: forProfile ? "row" : "auto",
        alignItems: forProfile ? "baseline" : "auto",
        gap: forProfile ? 3 : 0,
      }}
    >
      <Typography variant={variantType ? variantType : 'h5'}>Mutual Friends</Typography>
      <Typography>{mutualFriends.length ? mutualFriends.length : "None"}</Typography>
    </Stack>
  )
}

let CardSkeleton = () => {
  return (
    <CardElement
      className="card-wrapper"
      styles={{ backgroundColor: "text.secondary" }}
    >
      <SkeletonBasicElement width={"40px"} height="40px" />
      <CardContentElement>
        <SkeletonBasicElement variant='rectangular' />
        <SkeletonBasicElement variant='rectangular' />
        <SkeletonBasicElement variant='rectangular' height="40px" />
        <SkeletonBasicElement variant='rectangular' height="40px" />
      </CardContentElement>
    </CardElement>
  )
}

export default ConnectUsers