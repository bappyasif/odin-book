import { Twitter } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, CardHeader, CardMedia, IconButton, ImageList, ImageListItem, Link, Paper, Stack, Tooltip, Typography } from '@mui/material'
import { display } from '@mui/system';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { AppContexts } from '../App';
import { useToFetchSearchedTermedTwitterData } from './hooks/useToFetchData';
import { readDataFromServer } from './utils';

function ShowPostsFromTwitter() {
  const fakeTopics = ["astronomy", "animal planet"]

  let renderDataset = () => fakeTopics.map(name => <ShowSearchTermData key={name} searchTerm={name} />)

  return (
    <Box>
      <Typography>Showing Post from Twitter</Typography>
      {renderDataset()}
    </Box>
  )
}

const ShowSearchTermData = ({ searchTerm }) => {
  let [tweetsData, setTweetsData] = useState([])
  let [tweetsAttachments, setTweetsAttachments] = useState([])

  let appCtx = useContext(AppContexts);

  let { dataset } = useToFetchSearchedTermedTwitterData(searchTerm)

  const checkForDuplicatesTweets = (tweetsData) => {
    // tweetsData.
  }

  useEffect(() => {
    if (dataset?.data?.data?.length) {
      let slicedForTweets = dataset.data.data.slice(1)
      setTweetsData(slicedForTweets);
      // console.log(slicedForTweets, "tweetsliced")

      let attachments = dataset.data.data[0];
      setTweetsAttachments(attachments)
      // console.log(attachments, "tweetsattachment")
    }
  }, [dataset])

  // console.log(dataset?.data?.data, "tweetsdata!!", tweetsData, tweetsAttachments)

  let renderPosts = () => tweetsData.map(item => <RenderPost key={item.id} item={item} baseUrl={appCtx.baseUrl} attachments={tweetsAttachments} />)

  return (
    <Box>
      <Typography>Showing Post from Twitter</Typography>
      {tweetsData.length ? renderPosts() : null}
    </Box>
  )
}

export let RenderPost = ({ item, baseUrl, attachments }) => {
  let [userData, setUserData] = useState({})

  // manually creating a twitter link so that upon click user is redirected to actual post
  let tweetUrl = `https://twitter.com/twitter/status/${item.id}`

  let handleData = result => setUserData(result)

  let extractAccountNameAndUserName = () => {
    let url = `${baseUrl}/twitter/users/${item.author_id}`
    readDataFromServer(url, handleData)
  }

  useEffect(() => {
    extractAccountNameAndUserName()
  }, [item])

  userData && console.log(userData, "userData!!")

  return (
    userData?.data?.data.name
      ?
      <Card
        sx={{
          m: 1.5, p: 1.5, outline: "dashed", bgcolor: "secondary.text",
          maxWidth: "940px",
          margin: "auto"
        }}
      >
        <TweetCardHeader userData={userData} tweetUrl={tweetUrl} />
        <TweetCardContent item={item} />
        <TweetCardMedia item={item} attachments={attachments} />
      </Card>
      : null
  )
}

const TweetCardMedia = ({ item, attachments }) => {
  return (
    <CardMedia>
      <ShowTweetMediaResources item={item} attachments={attachments} />
    </CardMedia>
  )
}

const TweetCardContent = ({ item }) => {
  return (
    <CardContent>
      <Typography variant='h4'>{item.text}</Typography>
    </CardContent>
  )
}

const TweetCardHeader = ({ userData, tweetUrl }) => {
  return (
    <CardHeader
      // sx={{justifyContent: "start"}}
      avatar={
        <Avatar sx={{ width: "110px", height: "110px", objectFit: "contain" }}>
          <img width={110} height={110} src={userData?.data?.data.profile_image_url} />
        </Avatar>
      }

      title={
        <Stack sx={{ flexDirection: "row", gap: 1.1, alignItems: "baseline" }}>
          <Typography variant='h6' sx={{ textTransform: "capitalize" }}>{userData?.data?.data.name}</Typography>
          <Typography variant='body1'>@{userData?.data?.data.username}</Typography>
        </Stack>
      }

      subheader={
        <Stack sx={{ flexDirection: "row", gap: 1.1, alignItems: "baseline" }}>
          <Typography variant='body1'>Joined Since: {moment(userData?.data?.data.created_at).format("MM-DD-YYYY")}</Typography>
          <Typography variant='body1' sx={{ p: 2 }}>Followers: {userData?.data?.data.public_metrics.followers_count}</Typography>
          <Typography variant='body1' sx={{ p: 2 }}>Following: {userData?.data?.data.public_metrics.following_count}</Typography>
        </Stack>
      }

      action={
        <Tooltip title="see this post in twitter">
          <IconButton>
            <Link href={tweetUrl} target={"_blank"}>
              <Twitter />
            </Link>
          </IconButton>
        </Tooltip>
      }
    >

    </CardHeader>
  )
}

const ShowTweetMediaResources = ({ item, attachments }) => {
  let [mediaUrls, setMediaUrls] = useState([]);
  let [mediaIds, setMediaIds] = useState([]);

  let handleMediaResourceIds = () => {
    // console.log(item?.attachments?.media_keys?.length, "media", item?.attachments?.media_keys)
    if (item?.attachments?.media_keys?.length && attachments.media.length) {
      item.attachments.media_keys.forEach(mediaItem => {
        console.log(mediaItem, "mediaItem")
        setMediaIds(prev => [...prev, mediaItem])
      })
    }
  }

  const getMediaResourcesUrls = () => {
    attachments.media.forEach(mediaItem => {
      mediaIds.forEach(mediaId => {
        if (mediaId === mediaItem.media_key) {
          setMediaUrls(prev => [...prev, mediaItem.url])
        }
      })
    })
  }

  useEffect(() => {
    if (mediaIds.length) {
      getMediaResourcesUrls()
    }
  }, [mediaIds])

  useEffect(() => {
    // setMediaIds([])
    handleMediaResourceIds()
  }, [item])

  useEffect(() => setMediaIds([]), [])

  console.log(mediaUrls, "mediaUrls", mediaIds);

  let renderUrlResources = () => mediaUrls.map(url => <RenderMediaResource key={url} url={url} checkArrLength={mediaUrls.length} />)

  return (
    <ImageList
      sx={{
        maxHeight: "330px"
        // width: mediaUrls.length === 1 ? "max-content" : "auto",
        // display: mediaUrls.length !== 1 ? "flex" : "inline-block"
      }}
      // variant={mediaUrls.length >= 2 ? 'masonry' : "standard"}
      variant={"masonry"}
    >
      {mediaUrls.length ? renderUrlResources() : null}
    </ImageList>
  )
}

const RenderMediaResource = ({ url, checkArrLength }) => {
  return (
    <ImageListItem
      sx={{
        width: checkArrLength === 1 ? "100%" : checkArrLength === 2 ? "50%" : "auto",
        height: checkArrLength === 1 ? "330px !important" : checkArrLength === 2 ? "330px !important" : "auto"
      }}
    >
      <img
        // width={checkArrLength === 1 ? "100%" : checkArrLength === 2 ? "50%" : "auto"}
        // height={checkArrLength === 1 ? "330px !important" : checkArrLength === 2 ? "330px !important" : "auto"}
        style={{objectFit: "fill"}}
        height={"inherit"}
        src={url}
        loading={"lazy"}
      />
    </ImageListItem>
  )
}

export default ShowPostsFromTwitter