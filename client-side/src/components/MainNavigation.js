import React, { useContext, useEffect, useState } from 'react'
import { LoginTwoTone, AppRegistrationTwoTone, TimelineTwoTone, VerifiedUserSharp, DynamicFeedSharp, PeopleTwoTone, PersonTwoTone } from "@mui/icons-material";
import { H1Element, H4Element, NavElement, WrapperDiv } from './GeneralElements'
import { MuiButtonElement, MuiInputElement, TabElement } from './MuiElements';
import { FormElement, FormElementForwardedRef } from './FormElements';
import { sendDataToServer } from './utils';
import { AppContexts } from '../App';
import { useNavigate } from 'react-router-dom';

function MainNavigation() {
  return (
    <WrapperDiv className="nav-wrapper">
      <H1Element value={"OdBo"} />
      <NavigationLinks />
      <FloatingLogin />
    </WrapperDiv>
  )
}

export let NavigationLinks = () => {
  let appCtx = useContext(AppContexts);

  return (
    <NavElement className="main-nav">
      <TabElement className={"nav-item"} labelText={"Login"} path={"login"} icon={<LoginTwoTone />} />
      <TabElement className={"nav-item"} labelText={"Register"} path={"register"} icon={<AppRegistrationTwoTone />} />
      <TabElement className={"nav-item"} labelText={"Connect"} path={"connect"} icon={<VerifiedUserSharp />} />
      <TabElement className={"nav-item"} labelText={"Feeds"} path={"news-feeds"} icon={<DynamicFeedSharp />} />
      {/* <TabElement className={"nav-item"} labelText={"Friends"} path={"friend-requests"} icon={<PeopleTwoTone />} /> */}
      <TabElement className={"nav-item"} labelText={"Friends"} path={"user-friendships"} icon={<PeopleTwoTone />} />
      <TabElement className={"nav-item"} labelText={"Profile"} path={`users/${appCtx.user?._id}/profile`} icon={<PersonTwoTone />} />
    </NavElement>
  )
}

let FloatingLogin = () => {
  let [errors, setErrors] = useState([]);
  let [formData, setFormData] = useState({});

  const appCtx = React.useContext(AppContexts);
  const navigate = useNavigate();
  const ref = React.useRef(null);

  let handleChange = (evt, elm) => setFormData(prev => ({ ...prev, [elm]: evt.target.value }))

  let handleError = data => setErrors(data.errors)

  let updateData = result => {
    appCtx.handleData(result)
    // console.log(result, "result!!")
    ref.current?.reset();
    result.user?.topics.length < 4 ? navigate("/choose-topics") : navigate("/");
  }

  let handleSubmit = evt => {
    evt.preventDefault();
    sendDataToServer(appCtx.baseUrl + "/login", formData, handleError, updateData)
  }

  useEffect(() => handleError([]), [formData])

  return (
    <WrapperDiv className="fl-wrapper">
      <H4Element value={"Login to your profile"} />
      {/* <FormElement handleSubmit={handleSubmit} > */}
      {/* <FormElementForwardedRef handleSubmit={handleSubmit} ref={ref}> */}
      <form ref={ref} method={"post"} onSubmit={handleSubmit}>
        <MuiInputElement
          type={"email"}
          id={"email"}
          handleChange={handleChange}
          text="enter email (e.g. t@e.st)"
          required={true}
          color={errors?.length ? "error" : "success"}
          error={errors?.length ? true : false}
        />
        <MuiInputElement
          type={"password"}
          id={"password"}
          handleChange={handleChange}
          text="enter password"
          required={true}
          color={errors?.length ? "error" : "success"}
          error={errors?.length ? true : false}
        />
        <MuiButtonElement type={"submit"} text="Login" />
      </form>
      {/* </FormElementForwardedRef> */}
      {/* </FormElement> */}
    </WrapperDiv>
  )
}

export default MainNavigation