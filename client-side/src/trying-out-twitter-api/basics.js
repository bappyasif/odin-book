import React, { useEffect } from 'react'
// import {TwitterApi} from "twitter-api-v2"
// let {TwitterApi} = require("twitter-api-v2")

function BasicsUsage() {
    // console.log(process.env.REACT_APP_TWITTER_BEARER_TOKEN, process.env.REACT_APP_PORT, process.env.REACT_APP_TWITTER_CONSUMER_KEY)
    console.log(process.env.REACT_APP_TWITTER_BEARER_TOKEN, process.env.REACT_APP_PORT, process.env.REACT_APP_TWITTER_CONSUMER_KEY)
    
    let url ="http://localhost:3000/twitter/accounts/multiple/:names"
    // let accIds = {a: 1957404727, b: 3040721962}
    let accIds = {a: "bappyasif", b: "hoxieloxie"}

    let sendRequest = () => {
        let endpoint = new URL(url);
        endpoint.search = new URLSearchParams(accIds)
        console.log(endpoint, "endpoint")
        fetch(endpoint)
        .then(() => console.log("done"))
        .catch(err => console.error(err))
    }

    useEffect(() => sendRequest(), [])
    
    return (
        <div>BasicsUsage</div>
    )
}

export default BasicsUsage

// twitter api version 2
// const { TwitterApi } = require("twitter-api-v2")
// let path = require("path");

// require('dotenv/config')
// require("dotenv").config({
//     path: path.resolve(__dirname, '../config.env')
// })
// console.log(path.resolve(__dirname, '../config.env'))
// Authentication using OAuth2 (app-only or user context)
// Create a client with an already known bearer token
// const appOnlyClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN)
// console.log(process.env.REACT_APP_NOT_SECRET_CODE, process.env.REACT_APP_TWITTER_BEARER_TOKEN, process.env.PORT)
// const appOnlyClient = new TwitterApi("AAAAAAAAAAAAAAAAAAAAAI%2BYigEAAAAA4C4XPyGwUY1jGddemRIjD6HsamQ%3Dn2hOeGU1KkWTkmnBDQAGXYF4xjAnKYGTsIddAbU5GjSush6WGe")

// Tell typescript it's a readonly app
// const readOnlyClient = appOnlyClient.readOnly;

// Play with the built in methods
// readOnlyClient.v2.userByUsername('bappyasif').then(user => console.log(user)).catch(err=>console.error(err))
// const user = await readOnlyClient.v2.userByUsername('bappyasif');
// await twitterClient.v1.tweet('Hello, this is a test.');
// You can upload media easily!
// await twitterClient.v1.uploadMedia('./big-buck-bunny.mp4');

// or
/**
 *
 *
 // OAuth 1.0a (User context)
const userClient = new TwitterApi({
    appKey: 'consumerAppKey',
    appSecret: 'consumerAppSecret',
    // Following access tokens are not required if you are
    // at part 1 of user-auth process (ask for a request token)
    // or if you want a app-only client (see below)
    accessToken: 'accessOAuthToken',
    accessSecret: 'accessOAuthSecret',
  });

  // OR - you can also create a app-only client from your consumer keys -
  const appOnlyClientFromConsumer = await userClient.appLogin();
*/


// twitter api version 1
/**
 *
 *
const Twitter = require("twitter");
 // authentication, using OAuth 1.0a (User context)
let client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,

    // for application only authentication
    bearer_token: process.env.TWITTER_BEARER_TOKEN,
});

client.get("tweets/1586285711879467008", (err, tweets, response) => {
    if (err) console.error(err)
    console.log(tweets)
    console.log(response)
});
 */


// requests
/**
 * 
 * 
 client.get(path, params, callback);
 client.post(path, params, callback);
 client.stream(path, params, callback);
 */