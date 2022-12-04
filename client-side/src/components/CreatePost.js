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
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { PostAddTwoTone } from '@mui/icons-material'
import { sendDataToServer } from './utils'
import { AppContexts } from '../App'

function CreatePost({handleSuccessfullPostShared}) {
  let [addedOptions, setAddedOptions] = useState({})
  let [errors, setErrors] = useState([])
  let [postData, setPostData] = useState([])

  let ref = useRef();

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
      setAddedOptions(prev => ({ ...prev, [elm]: evt.target.getContent(), current: elm }))
    }
  }

  let createPost = () => {
    if (addedOptions.body) {
      console.log("create post")
      let url = `${appCtx.baseUrl}/posts/post/create/${appCtx.user._id}`
      sendDataToServer(url, addedOptions, handleErrors, handlePostData)
    } else {
      alert("at least post text needs to be there")
    }
  }

  // useEffect(() => postData?.length && setAddedOptions({}), [postData])

  console.log(addedOptions, "addedOptions!!", errors, postData)

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

          <form ref={ref}>
            <CardContentElement>
              <ShowRichTextEditor handleChange={handleAddedOptions} />
            </CardContentElement>
          </form>

          {/* showing user selected medias in post */}
          <ShowUserPostMedias mediaContents={addedOptions} />
          {/* <ShowUserPostMedias mediaType={"picture"} mediaContent={addedOptions.Image} /> */}
          {/* <ShowUserPostMedias mediaType={"picture"} mediaContent={"https://random.imagecdn.app/500/150"} /> */}

          <Stack
            flexDirection={"row"}
            alignItems={"baseline"}
            justifyContent={"center"}
            marginTop="2"
          >
            {iconsBtns.map(item => <ShowIconBtns key={item.name} item={item} handleAddedOptions={handleAddedOptions} />)}
          </Stack>

          <ShowClickActionsFunctionality currentElement={addedOptions.current} handleValue={handleAddedOptions} />

          <Stack onClick={createPost}>
            <Button variant='contained' endIcon={<PostAddTwoTone />}>
              <Typography variant={"h6"}>Create Post</Typography>
            </Button>
          </Stack>

        </CardElement>
      </PaperElement>
    </ContainerElement>
  )
}

let ShowRichTextEditor = ({ handleChange }) => {
  return (
    <>
      <Editor
        // initialValue="!!REMOVE!! This is the initial content of the editor"
        initialValue=" "
        init={{
          selector: 'textarea',  // change this value according to your HTML
          height: 200,
          branding: false,
          menubar: false,
          preview_styles: false,
          plugins: 'link code emoticons autolink',
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | emoticons'
        }}
        id="body"
        onChange={(e) => handleChange(e, 'body')}
      // onEditorChange={(e) => handleChange(e, 'body')}
      // onEditorChange={(content) => handleChange(null, 'body', content)}
      // onEditorChange={(e) => handleChange(e, 'body', e.target?.getContent())}
      // onChange={(e) => handleChange(e, 'body', e.target.getContent())}
      // onChange={(e) => console.log(e, 'body', e.target.getContent())}
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