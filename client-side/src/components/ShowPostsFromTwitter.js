import { Box, ImageList, ImageListItem, Link, Paper, Stack, Typography } from '@mui/material'
import { display } from '@mui/system';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { AppContexts } from '../App';
import { useToFetchSearchedTermedTwitterData } from './hooks/useToFetchData';
import { readDataFromServer } from './utils';

// function ShowPostsFromTwitter() {
//   let [dataset, setDataset] = useState({});

//   let appCtx = useContext(AppContexts);

//   let topic = "Sport"

//   let searchTerm = "Adult"

//   let handleDataset = result => setDataset(result)

//   let url = `${appCtx.baseUrl}/twitter/search/${topic}/${searchTerm}`

//   useEffect(() => {
//     readDataFromServer(url, handleDataset)
//   }, [url])

//   let renderPosts = () => dataset?.data?.data?.map((item) => <RenderPost key={item.id} item={item} baseUrl={appCtx.baseUrl} />)

//   console.log(dataset, "twitterdataset!!")
//   return (
// <Box>
//   <Typography>Showing Post from Twitter</Typography>
//   {/* {renderPosts()} */}
// </Box>
//   )
// }

function ShowPostsFromTwitter() {
  const fakeTopics = ["babes", "models"]

  let renderDataset = () => fakeTopics.map(name => <ShowSearchTermData key={name} searchTerm={name} />)

  return (
    <Box>
      <Typography>Showing Post from Twitter</Typography>
      {/* {renderPosts()} */}
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

  console.log(dataset?.data?.data, "tweetsdata!!", tweetsData, tweetsAttachments)

  let renderPosts = () => tweetsData.map(item => <RenderPost key={item.id} item={item} baseUrl={appCtx.baseUrl} attachments={tweetsAttachments} />)

  return (
    <Box>
      <Typography>Showing Post from Twitter</Typography>
      {tweetsData.length ? renderPosts() : null}
    </Box>
  )
}

export let RenderPost = ({ item, baseUrl, attachments }) => {
  let [imgUrl, setImgUrl] = useState(null)
  let [userData, setUserData] = useState({})

  // manually creating a twitter link so that upon click user is redirected to actual post
  // let tweetUrl = `https://twitter.com/twitter/status/${item.postData.id}`
  let tweetUrl = `https://twitter.com/twitter/status/${item.id}`

  let handleImgUrl = () => {
    if (item?.medias) {
      setImgUrl(item.medias[0].url)
    }
  }

  let handleData = result => setUserData(result)

  let extractAccountNameAndUserName = () => {
    // let url = `${baseUrl}/twitter/users/${item.postData.author_id}`
    let url = `${baseUrl}/twitter/users/${item.author_id}`
    readDataFromServer(url, handleData)
  }

  useEffect(() => {
    handleImgUrl()
    extractAccountNameAndUserName()
  }, [item])

  userData && console.log(userData, "userData!!")

  return (
    <Paper
      sx={{ m: 1.5, p: 1.5, outline: "dashed", bgcolor: "secondary.text", width: "940px", margin: "auto" }}
    >
      <Stack
        sx={{ flexDirection: "row" }}
      >
        <img width={69} height={62} src={userData?.data?.data.profile_image_url} />
        <Stack sx={{ ml: 4 }}>
          <Typography sx={{ textTransform: "capitalize" }}>{userData?.data?.data.name}</Typography>
          <Typography>@{userData?.data?.data.username}</Typography>
        </Stack>
      </Stack>
      <Stack
        sx={{ flexDirection: "row", ml: 11, alignItems: "center" }}
      >
        <Typography>Joined Since: {moment(userData?.data?.data.created_at).format("MM-DD-YYYY")}</Typography>
        <Stack
          sx={{ flexDirection: "row" }}
        >
          <Typography sx={{ p: 2 }}>Followers: {userData?.data?.data.public_metrics.followers_count}</Typography>
          <Typography sx={{ p: 2 }}>Following: {userData?.data?.data.public_metrics.following_count}</Typography>
        </Stack>
      </Stack>
      <Link href={tweetUrl} target={"_blank"}>
        <Box
          sx={{ m: 1, p: 1, outline: "solid", bgcolor: "secondary.text" }}
        >
          <Stack>
            {/* <Typography variant='h4'>{item.postData.text}</Typography> */}
            <Typography variant='h4'>{item.text}</Typography>
            {imgUrl ? <img src={imgUrl} height={'290px'} style={{ objectFit: "cover" }} /> : null}
            <ShowTweetMediaResources item={item} attachments={attachments} />
          </Stack>
        </Box>
      </Link>
    </Paper>
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
    handleMediaResourceIds()
  }, [item])

  useEffect(() => setMediaIds([]), [])

  console.log(mediaUrls, "mediaUrls");

  let renderUrlResources = () => mediaUrls.map(url => <RenderMediaResource key={url} url={url} checkArrLength={mediaUrls.length} />)

  return (
    <ImageList 
      sx={{
        maxHeight: "330px"
        // width: mediaUrls.length === 1 ? "max-content" : "auto",
        // display: mediaUrls.length !== 1 ? "flex" : "inline-block"
      }}
      variant={mediaUrls.length >= 2 ? 'masonry' : "standard"}
    >
      {mediaUrls.length ? renderUrlResources() : null}
    </ImageList>
  )
}

const RenderMediaResource = ({url, checkArrLength}) => {
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
        // style={{objectFit: "contain"}}
        src={url}
        loading={"lazy"}
      />
    </ImageListItem>
  )
}

export default ShowPostsFromTwitter