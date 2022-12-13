import { Twitter } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, CardHeader, CardMedia, IconButton, ImageList, ImageListItem, Link, Stack, Tooltip, Typography } from '@mui/material'
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { AppContexts } from '../App';
import { useToFetchSearchedTermedTwitterData } from './hooks/useToFetchData';
import { readDataFromServer } from './utils';

function ShowPostsFromTwitter({topics}) {
  // const appCtx = useContext(AppContexts);

  console.log(topics, "TOPICS!!")

  // let renderDataset = () => appCtx?.randomizedTopics.map(name => <ShowSearchTermData key={name} searchTerm={name} />)
  let renderDataset = () => topics.map(name => <ShowSearchTermData key={name} searchTerm={name} />)

  return (
    <Box>
      <Typography>Showing Post from Twitter</Typography>
      {topics.length ? renderDataset() : null}
      {/* {appCtx?.randomizedTopics.length ? renderDataset() : null} */}
    </Box>
  )
}

const ShowSearchTermData = ({ searchTerm }) => {
  let [tweetsData, setTweetsData] = useState([])
  let [tweetsAttachments, setTweetsAttachments] = useState([])

  let appCtx = useContext(AppContexts);

  let { dataset } = useToFetchSearchedTermedTwitterData(searchTerm)

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

  useEffect(() => {
    setTweetsData([])
    setTweetsAttachments([])
  }, [])

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

  // userData && console.log(userData, "userData!!")

  return (
    userData?.data?.data?.name
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

  const handleMediaResources = () => {
    attachments.media.forEach(mediaItem => {
      item.attachments.media_keys.forEach(mediaKey => {
        if ((mediaKey === mediaItem.media_key) && (mediaItem.url || mediaItem.preview_image_url)) {
          setMediaUrls(prev => {
            let chkIdx = prev.findIndex(item => (item.urlStr === mediaItem.url) || (item.urlStr === mediaItem.preview_image_url));
            return chkIdx === -1 ? [...prev, { urlStr: (mediaItem.url || mediaItem.preview_image_url), type: mediaItem.type }] : prev
          })
        }
      })
    })
  }

  useEffect(() => {
    // setMediaIds([])
    console.log("RUNNING!!")
    handleMediaResources()
  }, [])

  console.log(mediaUrls, "mediaUrls")

  let renderUrlResources = () => mediaUrls.map(item => <RenderMediaResource key={item} item={item} checkArrLength={mediaUrls.length} />)

  return (
    <ImageList
      // sx={{
      //   maxHeight: "330px"
      // }}
      variant={"masonry"}
      cols={mediaUrls.length > 1 ? 2 : 1}
    >
      {mediaUrls.length ? renderUrlResources() : null}
    </ImageList>
  )
}

const RenderMediaResource = ({ item, checkArrLength }) => {
  const decideElementMarkup = () => {
    let markup = ""
    if (item.type === "video") {
      console.log(item.type, "item.type")
      // markup = <video style={{ objectFit: "contain" }} height={"inherit"} loading={"lazy"}><source src={item.urlStr} type="video/mp4" /></video>
      markup = <img style={{ objectFit: "contain" }} height={"inherit"} src={item.urlStr} loading={"lazy"} />
    } else if (item.type === "photo") {
      markup = <img style={{ objectFit: "contain" }} height={"inherit"} src={item.urlStr} loading={"lazy"} />
    }
    return markup;
  }
  return (
    <ImageListItem
    // sx={{
    //   width: checkArrLength === 1 ? "100%" : "auto",
    //   height: checkArrLength === 1 ? "330px !important" : checkArrLength === 2 ? "330px !important" : "auto"
    // }}
    >
      {decideElementMarkup()}
    </ImageListItem>
  )
}

export default ShowPostsFromTwitter