import { CommentTwoTone } from '@mui/icons-material'
import { Box, Button, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContexts } from '../App'
import { useToCloseModalOnClickedOutside } from './hooks/toDetectClickOutside'
import { ButtonToIndicateHelp, HowToUsePostListItems } from './HowToUseApp'
import { DislikeIconElement, LikeIconElement, LoveIconElement, ShareIconElement } from './MuiElements'
import PostCommentModal from './PostCommentModal'
import { PostOrCommentOptions } from './PostOrCommentOptions'
import RenderPostComments from './RenderPostComments'
import RenderPostDataEssentials from './RenderPostData'
import LoginForm from './routes/LoginForm'
import SharePostModal, { ShowPostUserEngagementsDetails } from './SharePostModal'
import { readDataFromServer, sendDataToServer, updateDataInDatabase } from './utils'

function ShowUserCreatedPost({ postData, setShowCreatePost }) {
  let [commentsData, setCommentsData] = useState([])

  const appCtx = useContext(AppContexts)

  let handleCommentsDataUpdate = data => setCommentsData(prev => [...prev, data])

  let deleteCommentFromDataset = commentId => {
    let filteredComments = commentsData.filter(item => item._id !== commentId)
    setCommentsData(filteredComments)
  }

  // console.log(commentsData, "!!commentsData!!")

  // console.log(postData.userId === appCtx.user._id, postData.userId, appCtx.user._id, "vhk vhk")

  return (
    <Box
      width={990}
      margin="auto"
      border={"dotted .4px blue"}
      marginBottom={1.5}
      marginTop={1.3}
      borderRadius={1.1}
      position={"relative"}
    >
      <ButtonToIndicateHelp forWhichItem={"Post Listings"} />
      {appCtx.dialogTextFor === "Post Listings" ? <HowToUsePostListItems /> : null}
      <PostOrCommentOptions postId={postData._id} userId={postData.userId} />
      <RenderPostDataEssentials postData={postData} />
      {postData?.includedSharedPostId ? <ShowIncludedSharedPost appCtx={appCtx} includedPostId={postData.includedSharedPostId} /> : null}
      <UserEngagementWithPost postData={postData} appCtx={appCtx} setShowCreatePost={setShowCreatePost} handleCommentsDataUpdate={handleCommentsDataUpdate} />
      {(postData?.commentsCount || commentsData.length) ? <RenderPostComments postOwner={postData.userId === appCtx.user._id} postId={postData._id} commentsData={commentsData} setCommentsData={setCommentsData} deleteCommentFromDataset={deleteCommentFromDataset} /> : null}
      {/* {postData?.commentsCount ? showComments() : null} */}
    </Box>
  )
}

export let UserEngagementWithPost = ({ postData, appCtx, setShowCreatePost, handleCommentsDataUpdate }) => {
  let [counts, setCounts] = useState({})
  let [onlyUserCounts, setOnlyUserCounts] = useState({})
  let [time, setTime] = useState(null);
  let [session, setSession] = useState(null);
  let [dataReady, setDataReady] = useState(false)
  let [showModal, setShowModal] = useState(false);
  let [shareFlag, setShareFlag] = useState(false);
  let [showCommentModal, setShowCommentModal] = useState(false);
  let [commentText, setCommentText] = useState(null)

  let handleCommentText = evt => setCommentText(evt.target.value);

  let handleCommentCounts = () => {
    setCounts(prev => ({ ...prev, "Comment": prev["Comment"] ? prev["Comment"] + 1 : 1 }))
    setOnlyUserCounts(prev => ({ ...prev, Comment: prev["Comment"] ? prev["Comment"] + 1 : 1 }))
    // clearing out previously existing session element
    session && setSession(null)
    // setting a new timer with 2000ms, so that timer can take effect after that time
    setTime(2000);
  }

  let handleCounts = (elem, addFlag) => {
    setCounts(prev => ({
      ...prev,
      [elem]:
        (prev[elem] >= 0 && addFlag)
          ? prev[elem] + 1
          : prev[elem] - 1 < 0
            ? 0
            : prev[elem] - 1,
    }))

    setOnlyUserCounts(prev => ({ ...prev, [elem]: prev[elem] ? 0 : 1 }))

    // clearing out previously existing session element
    session && setSession(null)
    // setting a new timer with 2000ms, so that timer can take effect after that time
    setTime(2000);
  }

  let timer = () => {
    console.log("begin timer")
    let sesn = setTimeout(() => {
      // this gets to run only when user is not interacting
      // console.log("running!!", time)
      if (time >= 2000) {
        setDataReady(true);
        clearTimeout(sesn);
        setTime(0);
      }

    }, [time])

    // session with a timer is now in place, if not changed due to any user interaction through actionables
    // session setTimeout function will kick in and do a server call to update data in database
    setSession(sesn)
    console.log("begin session")
  }

  useEffect(() => {
    time && timer();
  }, [time])

  let updateThisPostCountsInDatabase = () => {
    let url = `${appCtx.baseUrl}/posts/${postData._id}/${appCtx.user._id}`

    console.log(counts, onlyUserCounts, "server")
    counts.currentUserCounts = onlyUserCounts;

    updateDataInDatabase(url, counts)
  }

  let handleCreateNewComment = () => {
    let url = `${appCtx.baseUrl}/comments/create/new`

    let data = {
      text: commentText,
      userId: appCtx.user._id,
      postId: postData._id
    }

    let handleSuccess = (result) => {
      // console.log(result.comment, "Result!!", result)
      // setCommentsData(prev => prev.push(result.comment))
      // setCommentsData(prev => [...prev, result.comment])
      handleCommentsDataUpdate(result.comment)
      setCommentText(null)
    }

    sendDataToServer(url, data, () => null, handleSuccess)
  }

  useEffect(() => {
    dataReady && updateThisPostCountsInDatabase()
    dataReady && commentText && handleCreateNewComment();
    dataReady && setDataReady(false);
  }, [dataReady])

  useEffect(() => {
    // making initial counts setup if any
    // console.log(postData, "postData!!")
    setCounts({
      Like: (postData?.likesCount || 0),
      Love: postData?.loveCount || 0,
      Dislike: postData?.dislikesCount || 0,
      Share: postData?.shareCount || 0,
      Comment: postData?.commentsCount || 0,
      engaggedUser: { Like: 0, Love: 0, Dislike: 0, Share: 0 }
      // engaggedUser: postData?.usersEngagged.length ? Object.values(postData?.usersEngagged[0])[0] : { Like: 0, Love: 0, Dislike: 0, Share: 0, Comment: 0 }
    })

    // initializing user specific counts
    // console.log(postData, postData?.usersEngagged.length ? Object.values(postData?.usersEngagged[0])[0] : {Like: 0, Love: 0, Dislike: 0, Share: 0}, "<><>")
    // setOnlyUserCounts(postData?.usersEngagged.length ? Object.values(postData?.usersEngagged[0])[0] : { Like: 0, Love: 0, Dislike: 0, Share: 0 })
  }, [])

  useEffect(() => {
    if (postData && postData?.usersEngagged.length && appCtx?.user._id) {
      let findIdx = postData?.usersEngagged?.findIndex(item => Object.keys(item)[0] === appCtx.user._id.toString())

      // setCounts(prev => ({ ...prev, engaggedUser: postData?.usersEngagged[findIdx] ? Object.values(postData?.usersEngagged[findIdx])[0] : { Like: 0, Love: 0, Dislike: 0, Share: 0 } }))
      postData?.usersEngagged[findIdx] && setCounts(prev => ({ ...prev, engaggedUser: Object.values(postData?.usersEngagged[findIdx])[0] }))
      // console.log(postData, findIdx, "findIdx!!", Object.values(postData?.usersEngagged[findIdx])[0])

      // updating user count with previously found count from server to have a synchronize count
      // findIdx && postData?.usersEngagged[findIdx] && setOnlyUserCounts(Object.values(postData?.usersEngagged[findIdx])[0])
      findIdx && postData?.usersEngagged[findIdx] && setOnlyUserCounts(Object.values(postData?.usersEngagged[findIdx])[0])
    }
  }, [postData])

  // console.log(session, "session!!", dataReady, counts, time)
  // console.log(counts, "counts!!")

  let handleShowCommentModal = () => setShowCommentModal(!showCommentModal)

  return (
    <Stack
      className="post-actions-icons"
      sx={{ flexDirection: "row", justifyContent: "center", backgroundColor: "lightblue", gap: 2, position: "relative" }}
    >
      {counts?.engaggedUser && actions.map(item => (
        <RenderActionableIcon key={item.name} appCtx={appCtx} handleShowCommentModal={handleShowCommentModal} setShowModal={setShowModal} item={item} counts={counts} handleCounts={handleCounts} setShowCreatePost={setShowCreatePost} />
      ))}

      {showModal ? <SharePostModal counts={counts} postData={postData} setShareFlag={setShareFlag} shareFlag={shareFlag} showModal={showModal} setShowModal={setShowModal} setShowCreatePost={setShowCreatePost} handleCounts={handleCounts} /> : null}

      {showCommentModal ? <PostCommentModal handleCommentText={handleCommentText} handleCommentCounts={handleCommentCounts} handleShowCommentModal={handleShowCommentModal} /> : null}
    </Stack>
  )
}

let RenderActionableIcon = ({ item, appCtx, handleCounts, counts, setShowModal, setShowCreatePost, handleShowCommentModal }) => {
  let [flag, setFlag] = useState(false);
  let [promptLogin, setPromptLogin] = useState(false);

  let handleClick = () => {
    if (appCtx.user._id) {
      setFlag(!flag);
      if (item.name === "Share") {
        setShowModal(true);
        setShowCreatePost(false);
      } else if (item.name === "Comment") {
        handleShowCommentModal()
      } else if (item.name !== "Share" || item.name !== "Comment") {
        handleCounts(item.name, !flag);
      }
    } else {
      setPromptLogin(true);
    }
  }

  // if user already had interacted with this post then turning flag on for indication for those
  useEffect(() => {
    if (counts?.engaggedUser && counts?.engaggedUser[item.name]) {
      setFlag(true)
    }
  }, [])

  // console.log(promptLogin, "promptLogin!!")

  // console.log(counts, "flag", flag)
  // item.name === "Comment" && console.log(counts[item.name], item.name, counts)

  return (
    <Tooltip title={(flag) ? `${item.name}d already` : (!appCtx.user._id) ? `Login to ${item.name}` : item.name}>
      <IconButton
        onClick={handleClick}
        sx={{
          backgroundColor: flag ? "beige" : "lightgrey",
          position: "relative"
        }}>
        <Button startIcon={counts[item.name] ? item.icon : null}>
          {counts[item.name] ? null : item.icon}
          <Typography variant={"subtitle2"}>{counts[item.name] ? counts[item.name] : null}</Typography>
        </Button>

        {(promptLogin && !appCtx.user._id) ? <ShowUserAuthenticationOptions setPromptLogin={setPromptLogin} itemName={item.name} /> : null}
      </IconButton>
    </Tooltip>
  )
}

export const ShowUserAuthenticationOptions = ({ setPromptLogin, itemName, forComments }) => {
  let ref = useRef(null);

  useToCloseModalOnClickedOutside(ref, () => setPromptLogin(false))

  let leftPlacement = () => {
    let measurement = "";

    // console.log(itemName, "itemName")

    if (forComments) {
      measurement = "-146px";
    } else {
      if (itemName === "Share") {
        measurement = "-696px";
      } else if (itemName === "Comment") {
        measurement = "-317px";
      } else if (itemName === "Like") {
        measurement = "-407px";
      } else if (itemName === "Dislike") {
        measurement = "-501px";
      } else if (itemName === "Love") {
        measurement = "-598px";
      } else if (itemName === "Create Post") {
        measurement = "-63px";
      }
    }
    return measurement
  }

  return (
    <Paper
      ref={ref}
      sx={{
        position: "absolute", bottom: "105px", left: leftPlacement(),
        zIndex: 18, width: itemName === "Create Post" ? "fit-content" : "max-content", outline: "solid 4px darkred"
      }}
    >
      <LoginForm />
    </Paper>
  )
}

export let ShowIncludedSharedPost = ({ includedPostId, appCtx }) => {
  let [sharedPostData, setSharedPostData] = useState({})

  let handleSharedPostData = result => {
    setSharedPostData(result.data.data)
  }

  let getSharedPostData = () => {
    let url = `${appCtx.baseUrl}/posts/solo/${includedPostId}/`;
    readDataFromServer(url, handleSharedPostData)
  }

  useEffect(() => {
    includedPostId && getSharedPostData();
  }, [includedPostId])

  // console.log(sharedPostData, "sharedPostData!!")

  let { likesCount, loveCount, dislikesCount, shareCount, _id } = { ...sharedPostData }

  let counts = {
    Like: likesCount,
    Love: loveCount,
    Dislike: dislikesCount,
    Share: shareCount
  }

  return (
    <Box
      sx={{
        p: 2,
        transform: "scale(.6, 0.8)",
        outline: "solid .4px red"
      }}
    >
      <Typography>Shared Post</Typography>
      {_id ? <RenderPostDataEssentials postData={sharedPostData} shareMode={true} /> : null}
      {_id ? <ShowPostUserEngagementsDetails counts={counts} /> : null}
    </Box>
  )
}

export let actions = [
  { name: "Comment", count: 0, icon: <CommentTwoTone /> },
  { name: "Like", count: 0, icon: <LikeIconElement /> },
  { name: "Dislike", count: 0, icon: <DislikeIconElement /> },
  { name: "Love", count: 0, icon: <LoveIconElement /> },
  { name: "Share", count: 0, icon: <ShareIconElement /> },
]

export default ShowUserCreatedPost