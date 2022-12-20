import React, { useContext, useEffect, useRef, useState } from 'react'
import { LoginTwoTone, AppRegistrationTwoTone, VerifiedUserSharp, DynamicFeedSharp, PeopleTwoTone, PersonTwoTone, DynamicFeedTwoTone, ManageAccountsTwoTone, LogoutTwoTone, InfoTwoTone } from "@mui/icons-material";
import { H1Element, NavElement, WrapperDiv } from './GeneralElements'
import { MuiInputElement, TabElement } from './MuiElements';
import { logoutUserFromApp, sendDataToServer } from './utils';
import { AppContexts } from '../App';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Avatar, Box, Button, ButtonGroup, FormControl, FormControlLabel, Switch, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useToCloseModalOnClickedOutside } from './hooks/toDetectClickOutside';

function MainNavigation() {
  let [showFloatingLogin, setShowFloatingLogin] = useState(true)

  let appCtx = useContext(AppContexts);

  const location = useLocation()

  useEffect(() => {
    if (location.pathname === "/login") {
      setShowFloatingLogin(false)
    } else if (location.pathname === "/register") {
      setShowFloatingLogin(false)
    } else {
      setShowFloatingLogin(true)
    }
  }, [location.pathname])

  return (
    <AppBar
      position="static"
      variant='outlined'
      sx={{
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "darkgrey"
      }}
    >
      <H1Element value={"OdBo"} />
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
            {showFloatingLogin ? <FloatingLogin /> : null}
          </>
      }
    </AppBar>
  )
}

const FloatingAuthenticatedUserFunctionality = ({ appCtx }) => {
  let [showDropdown, setShowDropdown] = useState(false)

  let ref = useRef();

  let toggleDropdown = () => setShowDropdown(prev => !prev)

  let closeDropdown = () => setShowDropdown(false);

  useToCloseModalOnClickedOutside(ref, closeDropdown)

  return (
    <Stack sx={{ flexDirection: "row", gap: 4, position: "relative", alignItems: "center" }}>
      <AssistiveModeActivatingToggler />
      <Typography variant="h6">Welcome, Dear {appCtx.user.fullName}</Typography>
      <Box ref={ref}>
        <Avatar onClick={toggleDropdown} alt={`profile picture of ${appCtx.user.fullName}`} src={appCtx.user.ppUrl || "https://random.imagecdn.app/500/150"} />
        {showDropdown ? <ShowAuthUserDropdowns closeDropdown={closeDropdown} /> : null}
      </Box>
    </Stack>
  )
}

const AssistiveModeActivatingToggler = () => {
  const appCtx = useContext(AppContexts);
  return (
    <Stack>
      <FormControlLabel
        control={
          <Switch
            checked={appCtx.assistiveMode}
            onChange={appCtx.handleAssitiveModeToggle}
            size='small'
            color="primary"
          />
        }
        label={`Turn ${appCtx.assistiveMode ? "Off" : "On"} Assitive Mode`}
      // labelPlacement="top"
      />
    </Stack>
  )
}

let ShowAuthUserDropdowns = ({ closeDropdown }) => {
  let options = [
    { name: "Assistive Mode", icon: <InfoTwoTone /> },
    { name: "Edit Profile", icon: <ManageAccountsTwoTone /> },
    { name: "Logout", icon: <LogoutTwoTone /> }
  ]

  let renderOptions = () => options.map(item => <RenderDropDownOption key={item.name} item={item} closeDropdown={closeDropdown} />)

  // let ref = useRef();

  // useToCloseModalOnClickedOutside(ref, closeDropdown)

  return (
    <Stack
      // ref={ref}
      sx={{
        position: "absolute", right: 0, top: "62px",
        gap: "9px", backgroundColor: "gainsboro", p: 2, zIndex: 9
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
      handleLogoutUser()
    } else if (item.name === "Edit Profile") {
      navigate(`/edit-user-profile`);
    } else if (item.name === "Assistive Mode") {
      appCtx.handleAssitiveModeToggle()
    }
    closeDropdown()
  }

  return (
    <Tooltip sx={{ mb: .2 }} title={item.name}>
      <Button onClick={handleClick} startIcon={item.icon} sx={{ outline: "solid 2px darkred", "&:hover": { outline: "solid 2px floralwhite" } }}>
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
  const buttonsProps = [
    { text: "Feeds", route: "/", icon: <DynamicFeedTwoTone /> },
    { text: "Login", route: "login", icon: <LoginTwoTone /> },
    { text: "Register", route: "register", icon: <AppRegistrationTwoTone /> },
  ]

  let renderButtons = () => buttonsProps.map(item => <ButtonElement key={item.text} item={item} />)

  return (
    <ButtonGroup
      sx={{
        alignItems: "center",
        gap: 2
      }}
      variant='outlined'
    >
      {renderButtons()}
    </ButtonGroup>
  )
}

let NavsWhenUserAuthenticated = ({ appCtx }) => {
  const buttonsProps = [
    { text: "Feeds", route: "/", icon: <DynamicFeedTwoTone /> },
    { text: "Connect", route: "connect", icon: <VerifiedUserSharp /> },
    { text: "Friendships", route: "user-friendships", icon: <PeopleTwoTone /> },
    { text: "Profile", route: `users/${appCtx.user?._id}/profile`, icon: <PersonTwoTone /> },
  ]

  let renderButtons = () => buttonsProps.map(item => <ButtonElement key={item.text} item={item} />)

  return (
    <ButtonGroup
      sx={{
        alignItems: "center",
        gap: 2
      }}
      variant='outlined'
    >
      {renderButtons()}
    </ButtonGroup>
  )
}

const ButtonElement = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(item.route)
  }

  return (
    <Button
      onClick={handleClick}
      variant={"text"}
      color={"info"}
      sx={{
        height: "fit-content",
        '&:hover': {
          backgroundColor: 'primary.main',
          opacity: .8,
          borderRadius: "11px",
          color: "gainsboro"
        },
      }}
      startIcon={item.icon}
    >
      <Typography variant='h6'>{item.text}</Typography>
    </Button>
  )
}

let FloatingLogin = () => {
  let [errors, setErrors] = useState([]);
  let [formData, setFormData] = useState({});

  const appCtx = React.useContext(AppContexts);
  const navigate = useNavigate();
  const ref = React.useRef(null);

  let handleChange = (evt, elm) => {
    let currentLength = evt.target.value.length;
    if (currentLength >= 0 && currentLength < 90) {
      setFormData(prev => ({ ...prev, [elm]: evt.target.value }))
    } else {
      alert(`you have exceeded ${elm} maximum limit of 89`)
    }
  }

  let handleError = data => {
    setErrors(data.errors)
  }

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
      <Typography variant='h5'>Login to your profile from here</Typography>
      <form
        ref={ref} method={"post"} onSubmit={handleSubmit}
        style={{ position: "relative", marginLeft: "11px" }}
      >
        {errors?.length ? <Typography variant='body2' sx={{ position: "absolute", color: "maroon", bottom: "-13px", left: "10.1px" }}>User email and password does not match!!</Typography> : null}

        <Stack
          sx={{
            flexDirection: "row",
            alignItems: "baseline"
          }}
        >
          <FormControl>
            <MuiInputElement
              type={"email"}
              id={"email"}
              handleChange={handleChange}
              text="enter email (e.g. t@e.st)"
              required={true}
              color={errors?.length ? "error" : "success"}
              error={errors?.length ? true : false}
              fontSize={"1.3em"}
            />
          </FormControl>
          <FormControl>
            <MuiInputElement
              type={"password"}
              id={"password"}
              handleChange={handleChange}
              text="enter password"
              required={true}
              color={errors?.length ? "error" : "success"}
              error={errors?.length ? true : false}
              fontSize={"1.3em"}
            />
          </FormControl>
          <Button
            color={"primary"}
            variant="contained"
            sx={{ height: "fit-content" }}
            type={"submit"}
          >
            <Typography variant='h6'>Login</Typography>
          </Button>
        </Stack>
      </form>
    </WrapperDiv>
  )
}

export default MainNavigation