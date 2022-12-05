import React, { useContext, useEffect, useRef, useState } from 'react'
import { LoginTwoTone, AppRegistrationTwoTone, VerifiedUserSharp, DynamicFeedSharp, PeopleTwoTone, PersonTwoTone } from "@mui/icons-material";
import { H1Element, H4Element, NavElement, WrapperDiv } from './GeneralElements'
import { MuiButtonElement, MuiInputElement, TabElement } from './MuiElements';
import { logoutUserFromApp, sendDataToServer } from './utils';
import { AppContexts } from '../App';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useToCloseModalOnClickedOutside } from './hooks/toDetectClickOutside';

function MainNavigation() {
  let appCtx = useContext(AppContexts);

  return (
    <WrapperDiv className="nav-wrapper">
      <H1Element value={"OdBo"} />
      {/* <NavigationLinks /> */}
      {
        appCtx?.user?._id
          ?
          <>
            <NavsWhenUserAuthenticated appCtx={appCtx} />
            <FloatingAuthenticatedUserFunctionality appCtx={appCtx} />
          </>
          :
          <>
            <NavsWhenUserIsNotAuthenticated />
            <FloatingLogin />
          </>
      }
    </WrapperDiv>
  )
}

const FloatingAuthenticatedUserFunctionality = ({ appCtx }) => {
  let [showDropdown, setShowDropdown] = useState(false)
  
  let toggleDropdown = () => setShowDropdown(!showDropdown)
  
  let closeDropdown = () => setShowDropdown(false);
  
  return (
    <Stack sx={{ flexDirection: "row", gap: 4, position: "relative", alignItems: "center" }}>
      <Typography variant="h6">Welcome, Dear {appCtx.user.fullName}</Typography>
      <Avatar onClick={toggleDropdown} alt={`profile picture of ${appCtx.user.fullName}`} src={appCtx.user.ppUrl || "https://random.imagecdn.app/500/150"} />
      {showDropdown ? <ShowAuthUserDropdowns closeDropdown={closeDropdown} /> : null}
    </Stack>
  )
}

let ShowAuthUserDropdowns = ({ closeDropdown }) => {
  let options = [{ name: "Edit Profile", icon: null }, { name: "Logout", icon: null }]

  let renderOptions = () => options.map(item => <RenderDropDownOption key={item.name} item={item} closeDropdown={closeDropdown} />)
  
  let ref = useRef();
  
  useToCloseModalOnClickedOutside(ref, closeDropdown)

  return (
    <Stack
      ref={ref} 
      sx={{
        position: "absolute", right: 0, top: "62px", 
        gap: "9px", backgroundColor: "gainsboro", p: 2
      }}
    >
      {renderOptions()}
    </Stack>
  )

}

const RenderDropDownOption = ({ item, closeDropdown }) => {
  let appCtx = useContext(AppContexts);

  const navigate = useNavigate();

  const clearOutUserData = () => {
    appCtx.clearCurrentUserData()
    navigate("/");
  }

  const handleLogoutUser = () => {
    let url = `${appCtx.baseUrl}/logout`
    logoutUserFromApp(url, clearOutUserData)
  }

  let handleClick = () => {
    if (item.name === "Logout") {
      closeDropdown()
      handleLogoutUser()
    } else if (item.name === "Edit Profile") {
      closeDropdown()
      navigate(`/edit-user-profile`);
    }
  }

  return (
    <Tooltip sx={{ mb: .2 }} title={item.name}>
      <Button onClick={handleClick} startIcon={item.icon} sx={{ outline: "solid 2px red" }}>
        <Typography variant='subtitle2'>{item.name}</Typography>
      </Button>
    </Tooltip>
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
      <TabElement className={"nav-item"} labelText={"Friends"} path={"user-friendships"} icon={<PeopleTwoTone />} />
      <TabElement className={"nav-item"} labelText={"Profile"} path={`users/${appCtx.user?._id}/profile`} icon={<PersonTwoTone />} />
    </NavElement>
  )
}

let NavsWhenUserIsNotAuthenticated = () => {
  return (
    <NavElement className="main-nav">
      <TabElement className={"nav-item"} labelText={"Login"} path={"login"} icon={<LoginTwoTone />} />
      <TabElement className={"nav-item"} labelText={"Register"} path={"register"} icon={<AppRegistrationTwoTone />} />
    </NavElement>
  )
}

let NavsWhenUserAuthenticated = ({ appCtx }) => {
  return (
    <NavElement className="main-nav">
      <TabElement className={"nav-item"} labelText={"Feeds"} path={"/"} icon={<DynamicFeedSharp />} />
      <TabElement className={"nav-item"} labelText={"Connect"} path={"connect"} icon={<VerifiedUserSharp />} />
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
    </WrapperDiv>
  )
}

export default MainNavigation