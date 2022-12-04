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

export const AppContexts = createContext()

function App() {
  let [user, setUser] = useState([]);
  let [jwtUser, setJwtUser] = useState({});
  let [userAccessiblePostsDataset, setUserAccessiblePostsDataset] = useState([])
  let location = useLocation()

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
  let updateAvailablePostsFeeds = dataset => setUserAccessiblePostsDataset(prev => [...prev, dataset])
  console.log(userAccessiblePostsDataset, "userPostsDataset!!")

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
    updateUserProfileDataInApp: updateUserProfileDataInApp
  }

  let getUser = () => {
    let url = `http://localhost:3000/login/success`
    getAuthenticatedUserDataFromServer(url, handleData)
  }

  useEffect(() => {
    // also making sure if oauth is not used and jwtToken is used then dont fetch data from server again on route changes
    Object.keys(jwtUser).length === 0 && location.pathname === "/" && getUser()
  }, [location.pathname === "/"])

  useEffect(() => {
    // when jwtUser data is present we'll deal with this, and for simplicity making userData empty
    if (Object.keys(jwtUser).length !== 0) { setUser(jwtUser) }
  }, [jwtUser])

  user && console.log(user, "user!!", jwtUser)

  return (
    <AppContexts.Provider value={contexts}>
      <div className="App" style={{ backgroundColor: "honeydew" }}>
        <MainNavigation />
        {/* <TryoutContainer /> */}
        {/* <BasicsUsage /> */}
        {/* <Hoc name="wat" /> */}
        {/* <LoggedIn loggedIn={true} /> */}
        {/* <LoggedIn loggedIn={false} /> */}
        <AbbreviateNumbers />
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
          <Route path='posts/:postId/comments' element={<PostCommentsThread />} />
          <Route path='/edit-user-profile' element={<EditUserProfile />} />
          <Route path='/users/:userID/profile' element={<UserProfile />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </div>
    </AppContexts.Provider>
  );
}

export default App;
