import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
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
import { getAuthenticatedUserDataFromServer } from './components/utils';
import UserSpecificNewsFeeds from './components/routes/UserSpecificNewsFeeds';
import UserFriendships from './components/routes/UserFriendships';
import PostCommentsThread from './components/routes/PostCommentsThread';
import UserProfile from './components/routes/UserProfile';
import Hoc from './misc/hoc';
import LoggedIn from './misc/loggedIn';
import { AbbreviateNumbers } from './misc';
import VisitAnotherUserProfile from './components/routes/VisitAnotherUserProfile';
import ContentsFromNyTimes from './components/ContentsFromNyTimes';

export const AppContexts = createContext()

function App() {
  let [user, setUser] = useState([]);
  let [jwtUser, setJwtUser] = useState({});
  let [userAccessiblePostsDataset, setUserAccessiblePostsDataset] = useState([])
  let [topics, setTopics] = useState([])
  let [dialogTextFor, setDialogTextFor] = useState(null);
  let [showDialogModal, setShowDialogModal] = useState(false);
  let [assistiveMode, setAssistiveMode] = useState(false);

  const location = useLocation()

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

      console.log(chkIdx, trimTopic(), "TOPIC")
      
      return chkIdx === -1 ? [...prev, trimTopic()] : prev
      // return chkIdx === -1 ? [...prev, foundTopics[rndNum]] : prev
    })
  }

  let handleData = result => {
    // console.log(result, "result!!")
    result?.user ? setJwtUser(result?.user) : setUser(result?.data?.data)
  }

  let updateData = (key, value) => setUser(prev => {
    // checking if data is already in list
    let fIdx = prev[key].findIndex(val => val === value);
    if(fIdx === -1 && key !== "frRecieved") {
      // adding to array list
      return ({ ...prev, [key]: [...prev[key], value] })
    } else {
      // removing from array list
      let filtered = prev[key].filter(val => val !== value);
      return ({ ...prev, [key]: filtered })
    }
  })

  const acceptOrRejectFriendRequestUpdater = (action, friendId) => {
    // console.log(friendId, action, "appStateUpdate!!")
    setUser(prev => {      
      if(action === "accept") {
        prev.friends.push(friendId)
      }

      let filtered = prev.frRecieved.filter(id => id !== friendId);

      return ({...prev, frRecieved: filtered})
    })
  }

  const updateUserProfileDataInApp = (propName, propValue) => {
    setUser(prev => ({...prev, [propName]: propValue}))
  }

  const removeUserIdFromCurrentUserFriendsList = (friendId) => {
    let filteredFriendsList = user.friends.filter(val => val !== friendId)
    setUser(prev => ({...prev, friends: filteredFriendsList}))
  }

  // let handleAvailablePostsFeeds = dataset => setUserAccessiblePostsDataset(prev => [...prev, dataset])
  let handleAvailablePostsFeeds = dataset => setUserAccessiblePostsDataset(dataset)
  
  let updateAvailablePostsFeeds = data => setUserAccessiblePostsDataset(prev => [...prev, data])
  
  const deletePostFromAvailablePostsFeeds = (postId) => {
    let filteredPosts = userAccessiblePostsDataset.filter(item => item._id !== postId)
    // console.log(filteredPosts, "filteredPosts!!")
    setUserAccessiblePostsDataset(filteredPosts)
  }

  console.log(userAccessiblePostsDataset, "userPostsDataset!!")

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
    assistiveMode: assistiveMode
  }

  useEffect(() => {
    // also making sure if oauth is not used and jwtToken is used then dont fetch data from server again on route changes
    // Object.keys(jwtUser).length === 0 && location.pathname === "/" && getUser()
  }, [location.pathname === "/"])

  useEffect(() => {
    // when jwtUser data is present we'll deal with this, and for simplicity making userData empty
    if (Object.keys(jwtUser).length !== 0) { setUser(jwtUser) }
  }, [jwtUser])

  useEffect(() => {
    if(topics.length && topics.length < 4 && user?._id) {
      randomlySelectSixTopics()
    }
  }, [topics])
  
  useEffect(() => {
    if(user._id && user.topics) {
      setTopics([])
    }
  }, [user._id])

  useEffect(() => {
    if(user?._id) {
      setTopics([])
    } else {
      const fakeTopics = ["astronomy", "animalplanet", "world", "sport"]
      setTopics(fakeTopics)
    }
  }, [])

  user && console.log(user, "user!!", jwtUser, process.env, process.env.REACT_APP_NY_TIMES_API_KEY, process.env.REACT_APP_NY_TIMES_API_SECRET)

  return (
    <AppContexts.Provider value={contexts}>
      <div className="App" style={{ backgroundColor: "honeydew" }}>
        <MainNavigation />
        {/* <TryoutContainer /> */}
        {/* <BasicsUsage /> */}
        {/* <Hoc name="wat" /> */}
        {/* <LoggedIn loggedIn={true} /> */}
        {/* <LoggedIn loggedIn={false} /> */}
        {/* <AbbreviateNumbers /> */}
        
        {/* <ContentsFromNyTimes /> */}
        
        <Routes>
          <Route path='/' element={<UserSpecificNewsFeeds />} />
          <Route path='/login' element={<LoginForm handleData={handleData} />} />
          <Route path='/login/success' element={<LoginSuccess />} />
          <Route path='/register' element={<RegisterUser handleData={handleData} />} />
          {/* <Route path='/friend-requests' element={<FriendsRequests />} /> */}
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
      </div>
    </AppContexts.Provider>
  );
}

export default App;
