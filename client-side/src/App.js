import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom"
// import TryoutContainer from './trying-out-mui-materials/TryoutContainer';
import './App.css';
import MainNavigation from './components/MainNavigation';
import LoginForm from './routes/LoginForm';
import RegisterUser from './routes/RegisterUser';
import ErrorPage from './components/ErrorPage';
import ConnectUsers from './routes/ConnectUsers';
import NewsFeeds from './routes/NewsFeeds';
import ChooseTopics from './routes/ChooseTopics';
import BasicsUsage from './trying-out-twitter-api/basics';
import EditUserProfile from './routes/EditUserProfile';
import TopicCategory from './routes/TopicCategory';
import LoginSuccess from './routes/LoginSuccess';
import { getAuthenticatedUserDataFromServer, getUserDataAfterJwtVerification, removeJwtDataFromLocalStorage, storeJwtAuthDataInLocalstorage, userStillLoggedIn } from './utils';
import UserSpecificNewsFeeds from './routes/UserSpecificNewsFeeds';
import UserFriendships from './routes/UserFriendships';
import PostCommentsThread from './routes/PostCommentsThread';
import UserProfile from './routes/UserProfile';
import Hoc from './misc/hoc';
import LoggedIn from './misc/loggedIn';
import { AbbreviateNumbers } from './misc';
import VisitAnotherUserProfile from './routes/VisitAnotherUserProfile';
import ContentsFromNyTimes from './components/ContentsFromNyTimes';
import { ThemeProvider } from '@emotion/react';
import { createTheme, Paper } from '@mui/material';
import { getDesignTokens } from './utils/customTheme';

export const AppContexts = createContext()

function App() {
  let [user, setUser] = useState([]);
  let [jwtUser, setJwtUser] = useState({});
  let [userAccessiblePostsDataset, setUserAccessiblePostsDataset] = useState([])
  let [topics, setTopics] = useState([])
  let [dialogTextFor, setDialogTextFor] = useState(null);
  let [showDialogModal, setShowDialogModal] = useState(false);
  let [assistiveMode, setAssistiveMode] = useState(false);
  let [darkMode, setDarkMode] = useState(false);
  let [jwtExists, setJwtExists] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  const handleToggleDarkMode = () => setDarkMode(prev => !prev)

  const handleAssitiveModeToggle = () => setAssistiveMode(!assistiveMode)

  const handleOpenDialogModal = () => setShowDialogModal(true)

  const handleCloseDialogModal = () => setShowDialogModal(false)

  const handleDialogTextFor = (name) => setDialogTextFor(name);

  const randomlySelectSixTopics = () => {
    let foundTopics = user.topics;

    let rndNum = Math.floor(Math.random() * foundTopics.length);

    setTopics(prev => {
      let chkIdx = prev.findIndex(topic => topic === foundTopics[rndNum])

      let trimTopic = () => foundTopics[rndNum].split(" ").join("")

      return chkIdx === -1 ? [...prev, trimTopic()] : prev
    })
  }

  let handleData = result => {
    // console.log(result, "result!!", jwtUser)
    result?.user ? setJwtUser(result?.user) : setUser(result?.data?.data)

    // this is for user authentication via third party passwport jwt startegy
    if (result?.data?.userJwt) {
      setUser(prev => ({ ...prev, userJwt: result.data.userJwt }))
      const data = result.data.userJwt;
      storeJwtAuthDataInLocalstorage(data.token, data.expiresIn)
    }

    // this is for jwt based passport authentication
    if (result?.userJwt) {
      setJwtUser(prev => ({ ...prev, userJwt: result.userJwt }))
      const data = result.userJwt;
      storeJwtAuthDataInLocalstorage(data.token, data.expiresIn)
    }

  }

  let updateData = (key, value) => setUser(prev => {
    // console.log(userStillLoggedIn(), "IS LOGGED -- UPDATE DATA!!")

    // checking if data is already in list
    let fIdx = prev[key].findIndex(val => val === value);
    if (fIdx === -1 && key !== "frRecieved") {
      // adding to array list
      return ({ ...prev, [key]: [...prev[key], value] })
    } else {
      // removing from array list
      let filtered = prev[key].filter(val => val !== value);
      return ({ ...prev, [key]: filtered })
    }
  })

  const acceptOrRejectFriendRequestUpdater = (action, friendId) => {
    // console.log(userStillLoggedIn(), "IS LOGGED -- User Friends!!")
    setUser(prev => {
      if (action === "accept") {
        prev.friends.push(friendId)
      }

      let filtered = prev.frRecieved.filter(id => id !== friendId);

      return ({ ...prev, frRecieved: filtered })
    })
  }

  const updateUserProfileDataInApp = (propName, propValue) => {
    // console.log(userStillLoggedIn(), "IS LOGGED -- UPDATE PROFILE!!")

    setUser(prev => ({ ...prev, [propName]: propValue }))
  }

  const removeUserIdFromCurrentUserFriendsList = (friendId) => {
    // console.log(userStillLoggedIn(), "IS LOGGED -- remove friend!!")

    let filteredFriendsList = user.friends.filter(val => val !== friendId)
    setUser(prev => ({ ...prev, friends: filteredFriendsList }))
  }

  let handleAvailablePostsFeeds = dataset => setUserAccessiblePostsDataset(dataset)

  let updateAvailablePostsFeeds = data => setUserAccessiblePostsDataset(prev => [...prev, data])

  const deletePostFromAvailablePostsFeeds = (postId) => {
    // console.log(userStillLoggedIn(), "IS LOGGED -- DELETE POST DATA!!")

    let filteredPosts = userAccessiblePostsDataset.filter(item => item._id !== postId)

    setUserAccessiblePostsDataset(filteredPosts)
  }

  // console.log(userAccessiblePostsDataset, "userPostsDataset!!")

  const clearCurrentUserData = () => {
    setUser({})
    setJwtUser({})
    setUserAccessiblePostsDataset({})
  }

  let getUser = () => {
    let url = `http://localhost:3000/login/success`
    getAuthenticatedUserDataFromServer(url, handleData)
    console.log("running from app scope!!")
  }

  const getUserDataFromJwtTokenStoredInLocalStorage = () => {
    const token = localStorage.getItem("token");

    const url = `http://localhost:3000/protected`

    if (userStillLoggedIn() && token) {
      getUserDataAfterJwtVerification(url, token, handleData)
      setJwtExists(true);
    } else if (!userStillLoggedIn() && token) {
      alert("your're login has expired, you will be redirected to login page")
      clearCurrentUserData();
      // removeJwtDataFromLocalStorage()
      setJwtExists(false);
      navigate("/login")
    }
  }

  const contexts = {
    baseUrl: "http://localhost:3000",
    user: user,
    handleData: handleData,
    updateData: updateData,
    acceptOrRejectFriendRequestUpdater: acceptOrRejectFriendRequestUpdater,
    handleAvailablePostsFeeds: handleAvailablePostsFeeds,
    availablePostsFeeds: userAccessiblePostsDataset,
    updateAvailablePostsFeeds: updateAvailablePostsFeeds,
    removeIdFromCurrentUserFriendsList: removeUserIdFromCurrentUserFriendsList,
    updateUserProfileDataInApp: updateUserProfileDataInApp,
    clearCurrentUserData: clearCurrentUserData,
    getUser: getUser,
    deletePostFromAvailablePostsFeeds: deletePostFromAvailablePostsFeeds,
    randomizedTopics: topics,
    handleOpenDialogModal: handleOpenDialogModal,
    handleCloseDialogModal: handleCloseDialogModal,
    handleDialogTextFor: handleDialogTextFor,
    dialogTextFor: dialogTextFor,
    showDialogModal: showDialogModal,
    handleAssitiveModeToggle: handleAssitiveModeToggle,
    assistiveMode: assistiveMode,
    handleToggleDarkMode: handleToggleDarkMode,
    darkMode: darkMode,
    randomlySelectSixTopics: randomlySelectSixTopics,
    isUserLoggedIn: userStillLoggedIn,
    getUserDataFromJwtTokenStoredInLocalStorage: getUserDataFromJwtTokenStoredInLocalStorage
  }

  useEffect(() => {
    // also making sure if oauth is not used and jwtToken is used then dont fetch data from server again on route changes
    // Object.keys(jwtUser).length === 0 && location.pathname === "/" && getUser()

    // making topics get refreshed before user comes back to news feeds
    user._id && topics.length && setTopics([])
  }, [location.pathname !== "/"])

  useEffect(() => {
    // when jwtUser data is present we'll deal with this, and for simplicity making userData empty
    if (Object.keys(jwtUser).length !== 0) { setUser(jwtUser) }
  }, [jwtUser])

  useEffect(() => {
    if (location.pathname === "/" && topics?.length > 0 && topics?.length < 4 && user?._id) {
      randomlySelectSixTopics()
    }
  }, [topics])

  useEffect(() => {
    if (user._id && user.topics) {
      setTopics([])
    }
  }, [user?._id])

  useEffect(() => {
    if (!user?._id) {
      const fakeTopics = ["astronomy", "animalplanet", "world", "sport"]
      setTopics(fakeTopics)
    }
  }, [])

  useEffect(() => {
    !jwtExists && getUserDataFromJwtTokenStoredInLocalStorage()
  }, [jwtExists])

  const theme = createTheme(getDesignTokens(darkMode ? "dark" : "light"))

  // user && console.log(user, "user!!", jwtUser, process.env, process.env.REACT_APP_NY_TIMES_API_KEY, process.env.REACT_APP_NY_TIMES_API_SECRET)

  return (
    <AppContexts.Provider value={contexts}>
      <div className="App" style={{ backgroundColor: "grey[400]", height: "100vh" }}>
        <MainNavigation />
        {/* <TryoutContainer /> */}
        {/* <BasicsUsage /> */}
        {/* <Hoc name="wat" /> */}
        {/* <LoggedIn loggedIn={true} /> */}
        {/* <LoggedIn loggedIn={false} /> */}
        {/* <AbbreviateNumbers /> */}

        {/* <ContentsFromNyTimes /> */}

        <ThemeProvider theme={theme}>
          <Paper>
            <Routes>
              <Route path='/' element={<UserSpecificNewsFeeds />} />
              <Route path='/login' element={<LoginForm handleData={handleData} />} />
              <Route path='/login/success' element={<LoginSuccess />} />
              <Route path='/register' element={<RegisterUser handleData={handleData} />} />
              <Route path='/user-friendships' element={<UserFriendships />} />
              <Route path='/choose-topics' element={<ChooseTopics />} />
              <Route path='/choose-topics/:category' element={<TopicCategory />} errorElement={<ErrorPage />} />
              <Route path='/connect' element={<ConnectUsers />} />
              <Route path='/news-feeds' element={<NewsFeeds />} />
              <Route path='/posts/:postId/comments' element={<PostCommentsThread />} />
              <Route path='/edit-user-profile' element={<EditUserProfile />} />
              <Route path='/users/:userID/profile' element={<UserProfile />} />
              <Route path='/users/:userID/visit/profile' element={<VisitAnotherUserProfile />} />
              <Route path='*' element={<ErrorPage />} />
            </Routes>
          </Paper>
        </ThemeProvider>
      </div>
    </AppContexts.Provider>
  );
}

export default App;
