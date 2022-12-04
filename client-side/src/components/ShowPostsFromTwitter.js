import { Box, Link, Paper, Stack, Typography } from '@mui/material'
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import { AppContexts } from '../App';
import { readDataFromServer } from './utils';

function ShowPostsFromTwitter() {
  let [dataset, setDataset] = useState({});

  let appCtx = useContext(AppContexts);

  let topic = "Sport"

  let searchTerm = "World Cup"

  let handleDataset = result => setDataset(result)

  let url = `${appCtx.baseUrl}/twitter/search/${topic}/${searchTerm}`

  useEffect(() => {
    readDataFromServer(url, handleDataset)
  }, [url])

  let renderPosts = () => dataset?.data?.data?.map((item) => <RenderPost key={item.id} item={item} baseUrl={appCtx.baseUrl} />)

  console.log(dataset, "dataset!!")
  return (
    <Box>
      <Typography>Showing Post from Twitter</Typography>
      {renderPosts()}
    </Box>
  )
}

export let RenderPost = ({ item, baseUrl }) => {
  let [imgUrl, setImgUrl] = useState(null)
  let [userData, setUserData] = useState({})

  // manually creating a twitter link so that upon click user is redirected to actual post
  let tweetUrl = `https://twitter.com/twitter/status/${item.postData.id}`

  let handleImgUrl = () => {
    if (item?.medias) {
      setImgUrl(item.medias[0].url)
    }
  }

  let handleData = result => setUserData(result)

  let extractAccountNameAndUserName = () => {
    let url = `${baseUrl}/twitter/users/${item.postData.author_id}`
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
        <Stack sx={{ml: 4}}>
          <Typography sx={{textTransform: "capitalize"}}>{userData?.data?.data.name}</Typography>
          <Typography>@{userData?.data?.data.username}</Typography>
        </Stack>
      </Stack>
      <Stack
        sx={{ flexDirection: "row", ml: 11, alignItems:"center" }}
      >
        <Typography>Joined Since: {moment(userData?.data?.data.created_at).format("MM-DD-YYYY")}</Typography>
        <Stack
          sx={{ flexDirection: "row" }}
        >
          <Typography sx={{p: 2}}>Followers: {userData?.data?.data.public_metrics.followers_count}</Typography>
          <Typography sx={{p: 2}}>Following: {userData?.data?.data.public_metrics.following_count}</Typography>
        </Stack>
      </Stack>
      <Link href={tweetUrl} target={"_blank"}>
        <Box
          sx={{ m: 1, p: 1, outline: "solid", bgcolor: "secondary.text" }}
        >
          <Stack>
            <Typography variant='h4'>{item.postData.text}</Typography>
            {imgUrl ? <img src={imgUrl} height={'290px'} style={{objectFit: "cover"}} /> : null}
          </Stack>
        </Box>
      </Link>
    </Paper>
  )
}

export default ShowPostsFromTwitter