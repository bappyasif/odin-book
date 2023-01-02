import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom"
// import TryoutContainer from './trying-out-mui-materials/TryoutContainer';
import './App.css';
import MainNavigation from './components/MainNavigation';
import LoginForm from './components/routes/LoginForm';
import RegisterUser from './components/routes/RegisterUser';
import ErrorPage from './components/ErrorPage';
import ConnectUsers from './components/routes/ConnectUsers';
import NewsFeeds from './components/routes/NewsFeeds';
import ChooseTopics from './components/routes/ChooseTopics';
import BasicsUsage from './trying-out-twitter-api/basics';
import EditUserProfile from './components/routes/EditUserProfile';
import TopicCategory from './components/routes/TopicCategory';
import LoginSuccess from './components/routes/LoginSuccess';
import { getAuthenticatedUserDataFromServer, getUserDataAfterJwtVerification, removeJwtDataFromLocalStorage, storeJwtAuthDataInLocalstorage, userStillLoggedIn } from './components/utils';
import UserSpecificNewsFeeds from './components/routes/UserSpecificNewsFeeds';
import UserFriendships from './components/routes/UserFriendships';
import PostCommentsThread from './components/routes/PostCommentsThread';
import UserProfile from './components/routes/UserProfile';
import Hoc from './misc/hoc';
import LoggedIn from './misc/loggedIn';
import { AbbreviateNumbers } from './misc';
import VisitAnotherUserProfile from './components/routes/VisitAnotherUserProfile';
import ContentsFromNyTimes from './components/ContentsFromNyTimes';
import { ThemeProvider } from '@emotion/react';
import { createTheme, Paper } from '@mui/material';
import { amber, blueGrey, deepOrange, grey } from '@mui/material/colors';

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

  const location = useLocation()

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

  // const saveJwtTokensInLocalStorage = (jwtData) => {
  //   localStorage.setItem("token", jwtData.token)
  //   localStorage.setItem("expires", jwtData.expiresIn)
  //   // console.log(jwtData, "!!jwtData!!")
  // }

  let handleData = result => {
    // console.log(result, "result!!", jwtUser)
    result?.user ? setJwtUser(result?.user) : setUser(result?.data?.data)

    // this is for user authentication via third party passwport jwt startegy
    if (result?.data?.userJwt) {
      setUser(prev => ({ ...prev, userJwt: result.data.userJwt }))
      // saveJwtTokensInLocalStorage(result.data.userJwt)
      const data = result.data.userJwt;
      storeJwtAuthDataInLocalstorage(data.token, data.expiresIn)
    }

    // this is for jwt based passport authentication
    if (result?.userJwt) {
      setJwtUser(prev => ({ ...prev, userJwt: result.userJwt }))
      // saveJwtTokensInLocalStorage(result.userJwt)
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

  const demoHandler = result => console.log(result)
  const navigate = useNavigate()

  const getUserDataFromJwtTokenStoredInLocalStorage = () => {
    const token = localStorage.getItem("token");
    const url = `http://localhost:3000/protected`
    // getUserDataAfterJwtVerification(url, token, demoHandler)
    if (userStillLoggedIn() && token) {
      getUserDataAfterJwtVerification(url, token, handleData)
      setJwtExists(true);
    } else if (!userStillLoggedIn() && token) {
      alert("your're login has expired, you will be redirected to login page")
      clearCurrentUserData();
      removeJwtDataFromLocalStorage()
      setJwtExists(false);
      navigate("/login")
    }

    // userStillLoggedIn() && token && getUserDataAfterJwtVerification(url, token, handleData)
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

      // get user data from stored jwt token, if any
      // !jwtExists && getUserDataFromJwtTokenStoredInLocalStorage()
    }
  }, [])

  useEffect(() => {
    !jwtExists && getUserDataFromJwtTokenStoredInLocalStorage()
  }, [jwtExists])

  // useEffect(() => {
  //   if (user?._id) {
  //     setTopics([])
  //   } else {
  //     const fakeTopics = ["astronomy", "animalplanet", "world", "sport"]
  //     setTopics(fakeTopics)
  //   }
  // }, [])
  const getDesignTokens = (mode) => ({
    palette: {
      mode,
      primary: {
        // ...amber,
        ...(mode === 'dark' && {
          main: "#22223B",
        }),
        ...(mode === 'light' && {
          main: "#4A4E69",
          main: "#001845"
        }),
      },
      secondary: {
        // ...amber,
        ...(mode === 'dark' && {
          main: "#4A4E69",
        }),
        ...(mode === 'light' && {
          main: "#C9ADA7",
        }),
      },
      ...(mode === 'dark' && {
        background: {
          default: "#4A4E69",
          paper: "#22223B",
        },
        info: {
          main: "#001845"
        }
      }),
      ...(mode === 'light' && {
        background: {
          default: "#F2E9E4",
          // paper: "#6D6875",
        },
        info: {
          // main: "#6D6875"
          main: "#FEFAE0"
        }
      }),
      text: {
        ...(mode === 'light'
          ? {
            primary: grey[900],
            secondary: grey[800],
          }
          : {
            primary: grey[400],
            secondary: grey[200],
            // info: {
            //   contrastText: grey[200]
            // }
          }),
      },
    },
  });

  const theme = createTheme(getDesignTokens(darkMode ? "dark" : "light"))

  // const theme = createTheme({
  //   palette: {
  //     mode: darkMode ? "dark" : "light",
  //   }
  // })

  // user && console.log(user, "user!!", jwtUser, process.env, process.env.REACT_APP_NY_TIMES_API_KEY, process.env.REACT_APP_NY_TIMES_API_SECRET)

  return (
    <AppContexts.Provider value={contexts}>
      <div className="App" style={{ backgroundColor: "grey[400]" }}>
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
