import React, { useContext, useEffect, useRef, useState } from 'react'
import { GiphyFetch } from "@giphy/js-fetch-api"
import { Gif, Grid } from "@giphy/react-components"
import EmojiPicker from "emoji-picker-react"
import { Editor } from "@tinymce/tinymce-react"
import { FormElement } from './FormElements'
import { BoxElement, ButtonElement, CardContentElement, CardElement, CardHeaderElement, ContainerElement, EmoticonElement, FormControlElement, GifElement, HelperTextElement, IconButtonElement, ImageElement, InputLabelElement, PaperElement, PollElement, PrivacyElement, SearchUserInputElement, TypographyElement, UserInputElement, VideoCameraFrontElement } from './MuiElements'
import ChoosePrivacy from './ChoosePrivacy'
import CreatePoll from './CreatePoll'
import ShowUserPostMedias from './ShowUserPostMedias'
import { Box, Button, CircularProgress, IconButton, Stack, Typography } from '@mui/material'
import { PostAddTwoTone } from '@mui/icons-material'
import { sendDataToServer } from './utils'
import { AppContexts } from '../App'
import { useNavigate } from 'react-router-dom'

function CreatePost({ handleSuccessfullPostShared }) {
  let [addedOptions, setAddedOptions] = useState({})
  let [errors, setErrors] = useState([])
  let [postData, setPostData] = useState([])
  let [postText, setPostText] = useState(null)

  let ref = useRef();

  const navigate = useNavigate()

  let appCtx = useContext(AppContexts)

  let handleErrors = data => setErrors(data.errors);

  let handlePostData = result => {
    setPostData(result.post)
    setAddedOptions({})
    appCtx.updateAvailablePostsFeeds(result.post)
    ref.current.reset()
    handleSuccessfullPostShared && handleSuccessfullPostShared(result.post._id)
  }

  let handleAddedOptions = (evt, elm, val) => {
    if (elm !== "body") {
      val
        ? setAddedOptions(prev => ({ ...prev, [elm]: val, current: elm }))
        : setAddedOptions(prev => ({ ...prev, current: elm }))
    } else {
      // console.log(evt.target)
      // console.log(addedOptions["body"]?.length, "body length", evt.target.getContent().length)

      setAddedOptions(prev => ({ ...prev, [elm]: evt.target.getContent(), current: elm }))
    }
  }

  let createPost = () => {
    if (appCtx.user._id) {
      if (addedOptions.body) {
        if (addedOptions.body.length < 220) {
          console.log("create post")
          let url = `${appCtx.baseUrl}/posts/post/create/${appCtx.user._id}`
          sendDataToServer(url, addedOptions, handleErrors, handlePostData)
        } else {
          alert("more than characters limit count found, maximum word count is 220")
        }
      } else {
        alert("at least post text needs to be there")
      }
    } else {
      // setPromptLogin(!promptLogin)
      // re routing prompt for user consent to login page for authentication
      let choose = prompt("you need to be registered or authenticated before creating any post, do you want to proceed to login Page? Y || N", "Y")
      if (choose === "Y" || choose === "y") {
        navigate("/login")
      }
    }
  }

  // useEffect(() => postData?.length && setAddedOptions({}), [postData])

  // console.log(addedOptions, "addedOptions!!", errors, postData, postText)

  return (
    <ContainerElement width={"md"}>
      <PaperElement>
        <CardElement>
          <CardHeaderElement
            avatarUrl={appCtx.user?.ppUrl || "https://random.imagecdn.app/500/150"}
            altText={"fullname"}
            title={appCtx.user?.fullName || "User Name"}
            joined={appCtx.user?.created || Date.now()}
          />

          <CardContentElement>
            <form ref={ref} style={{position: "relative"}}>
              <ShowRichTextEditor handleChange={handleAddedOptions} setPostText={setPostText} />
              <VisualizeWordCountProgress postText={postText} maxLimit={220} />
            </form>
            <ShowUserPostMedias mediaContents={addedOptions} />
          </CardContentElement>

          {/* showing user selected medias in post */}
          {/* <ShowUserPostMedias mediaContents={addedOptions} /> */}

          <Stack
            flexDirection={"row"}
            alignItems={"baseline"}
            justifyContent={"center"}
            marginTop="2"
          >
            {iconsBtns.map(item => <ShowIconBtns key={item.name} item={item} handleAddedOptions={handleAddedOptions} />)}
          </Stack>

          <ShowClickActionsFunctionality currentElement={addedOptions.current} handleValue={handleAddedOptions} />

          <Stack
            sx={{ position: "relative" }}
            onClick={createPost}
          >
            <Button variant='contained' endIcon={<PostAddTwoTone />}>
              <Typography variant={"h6"}>{!appCtx.user._id ? "Login to " : ""}Create Post</Typography>
            </Button>

            {/* for some reason there is a "ref" inteference with this and Authentication Prompt component "ref" */}
            {/* thats rather making user re route to "login" page with user consent through a prompt dialog box */}
            {/* {!appCtx.user._id && promptLogin ? <ShowUserAuthenticationOptions setPromptLogin={setPromptLogin} itemName="Create Post" /> : null} */}
          </Stack>

        </CardElement>
      </PaperElement>
    </ContainerElement>
  )
}

const VisualizeWordCountProgress = ({postText, maxLimit}) => {
  let [progress, setProgress] = useState(0);
  
  let handleProgress = () => {
    let countPercentile = Math.round((postText?.length/maxLimit)*100)
    if (postText?.length <= maxLimit) {
      // console.log(countPercentile, "countPercentile", postText, (postText?.length/20), (postText?.length/20)*100)
      // console.log(postText)
      setProgress(countPercentile)
    } else {
      alert("character count limit exceeded!!")
    }
    // console.log(count, "progress")
  }

  useEffect(() => {
    postText?.length && handleProgress()
  }, [postText])

  return (
    <CircularProgress 
      sx={{
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 9
      }}
      variant="determinate" 
      value={progress} 
    />
  )
}

let ShowRichTextEditor = ({ handleChange, setPostText }) => {
  // let handlePostBodyChange = (evt) => {
  //   console.log(evt.target.getContent().length)
  //   setPostText(evt.target.getContent())
  //   handleChange(evt, 'body')
  // }
  return (
    <>
      <Editor
        initialValue=" "
        init={{
          selector: 'textarea',  // change this value according to your HTML
          init_instance_callback: function (editor) {
            // editor.on('click', function (e) {
            //   console.log('Element clicked:', e.target.nodeName);
            // });
            editor.on("keyup change", (e) => {
              // const content = editor.getContent();
              // console.log(content, "!!")
              // console.log(e.target, editor.getContent())
              
              // let regExp = /^(<[a-z]+>)|^(<\/[a-z]+>)/g
              // let regExp = /^(<[a-z]+>).^(<\/[a-z]+>)/g
              // let regExp = /<[^>]*>|[&nbsp;]/g
              // let preRe = /^[&nbsp;]/
              let regExp = /<[^>]*>/g
              setPostText(editor.getContent().replace(regExp, ''))

              // console.log(editor.getContent().replace(regExp, ''))
              // editor.getContent().match(regExp); // still getting tags matched
              // editor.getContent().match(regExp)?.length
              // console.log(editor.getContent().match(regExp), editor.getContent().match(regExp)?.length)
              // setPostText(editor.getContent())
              // setPostText(editor.getBody())
            });
          },
          height: 200,
          branding: false,
          menubar: false,
          preview_styles: false,
          plugins: 'link code emoticons autolink wordcount',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | emoticons | wordcount',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:22px }'
        }}
        id="body"
        onChange={(e) => handleChange(e, 'body')}
        // onChange={handlePostBodyChange}
      />
    </>
  )
}

let ShowClickActionsFunctionality = ({ currentElement, handleValue }) => {
  let renderFunctionality = null;

  if (currentElement === "Image" || currentElement === "Video") {
    renderFunctionality = <ShowUrlGrabbingForm handleValue={handleValue} currentElement={currentElement} />
  } else if (currentElement === "Gif") {
    renderFunctionality = <ShowGifSelectingElement handleValue={handleValue} currentElement={currentElement} />
  } else if (currentElement === "Emoji") {
    renderFunctionality = <ShowEmoJiPickerElement />
  } else if (currentElement === "Poll") {
    renderFunctionality = <CreatePoll handleValue={handleValue} currentElement={currentElement} />
  } else if (currentElement === "Privacy") {
    renderFunctionality = <ChoosePrivacy handleValue={handleValue} currentElement={currentElement} />
  }

  return (
    renderFunctionality
  )
}

let ShowEmoJiPickerElement = () => {
  return (
    <>
      <EmojiPicker />
    </>
  )
}

let ShowGifSelectingElement = ({ handleValue, currentElement }) => {
  let [searchText, setSearchText] = useState(null);
  let [gifData, setGifData] = useState(null);

  let giphyFetch = new GiphyFetch("TpnE8CtDArV0DqW17cilRKXCIptJJ621");

  let fetchGifs = (offset) => searchText ? giphyFetch.search(searchText, { offset, limit: 10 }) : giphyFetch.trending({ offset, limit: 10 });

  let handleOnGifClicked = (gif, e) => {
    e.preventDefault();
    console.log(gif, "gif!!")
    setGifData(gif)
    handleValue(e, currentElement, gif);
    handleValue(e, "choose again", "");
  }

  let handleSearchText = evt => setSearchText(evt.target.value)

  return (
    <BoxElement>
      {/* {gifData && <Gif gif={gifData} width={200} height={200} />} */}

      <ShowGifSearch handleSearchText={handleSearchText} />

      <Grid
        onGifClick={handleOnGifClicked}
        fetchGifs={fetchGifs}
        width={window.innerWidth}
        columns={7}
        gutter={6}
        key={searchText}
      />
    </BoxElement>
  )
}

let ShowGifSearch = ({ handleSearchText }) => {
  return (
    <BoxElement>
      <FormControlElement>
        <InputLabelElement hFor={"url"} text={"Search Gif"} />
        <SearchUserInputElement id={"url"} helperId={null} type={"text"} handleChange={handleSearchText} />
      </FormControlElement>
    </BoxElement>
  )
}

let ShowUrlGrabbingForm = ({ handleValue, currentElement }) => {
  let [value, setValue] = useState(null);

  // const ref = useRef();

  let handleChange = event => setValue(event.target.value)

  let handleSubmit = event => {
    event.preventDefault();
    // uploading url into state
    handleValue(event, currentElement, value);
    // changing current elemnt to something which has no actionable components attached to it
    handleValue(event, "choose again", "");
    // reseting form value, but didnt have to as we're closing this functionable components
    // ref.current.reset();
  }

  return (
    <Box sx={{ m: 2 }}>
      <FormElement handleSubmit={handleSubmit}>
        <FormControlElement>
          <InputLabelElement hFor={"url"} text={"Enter Url Of Media Resource Here"} />
          <UserInputElement id={"url"} helperId="url-helper-text" type={"text"} handleChange={handleChange} />
          <HelperTextElement id={"url-helper-text"} text={"Enter a valid a url of your media resource"} />
        </FormControlElement>
        <ButtonElement type={"submit"} text="Upload" variant={"contained"} />
      </FormElement>
    </Box>
  )
}

let ShowIconBtns = ({ item, handleAddedOptions }) => {
  return (
    <Button onClick={e => handleAddedOptions(e, item.name, '')} variant='outlined' startIcon={item.elem} sx={{ m: 1.3, mt: 0 }}>
      <TypographyElement text={item.name} type={"span"} />
    </Button>
  )
}

// dataset for post create icons elements
let iconsBtns = [
  { name: "Image", elem: <ImageElement /> },
  { name: "Video", elem: <VideoCameraFrontElement /> },
  { name: "Gif", elem: <GifElement /> },
  // { name: "Emoji", elem: <EmoticonElement /> },
  { name: "Poll", elem: <PollElement /> },
  { name: "Privacy", elem: <PrivacyElement /> }
];

export default CreatePost