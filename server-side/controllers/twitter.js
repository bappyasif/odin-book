let { TwitterApi } = require("twitter-api-v2")
let needle = require("needle");
const { getDataFromTwitter } = require("../utils/httpRequests");
// let endpoint = '';

let getTweetsFromAccount = (req, res, next) => {
    let accountId = req.params.name;
    res.send("get tweet from account")
}

let getTweetsFromMultipleAccounts = (req, res, next) => {
    let endpoint = "https://api.twitter.com/2/users/?ids="
    // let endpoint = "https://api.twitter.com/2/users/by?usernames="
    
    for(let key in req.query) {
        endpoint+= req.query[key].toString() +","
    }
    
    let accountId = req.params.names;
    
    console.log(req.params, "<><>", req.query, endpoint)
    
    const params = {
        // "usernames": "bappyasif,hoxieloxie",
        ids: "1957404727,3040721962",
        "user.fields": "created_at,description", // Edit optional query parameters here
        "expansions": "pinned_tweet_id"
    }

    getTweetsFromMultipleAccountIds(endpoint, params).then(results => console.log(results)).catch(err=>console.error(err))
    // getTweetsFromMultipleAccountIds("https://api.twitter.com/2/users?ids=1957404727,3040721962").then(results => console.log(results)).catch(err=>console.error(err))
    
    res.send("get tweets from multiple account")
}

let getTweetsAboutTopic = (req, res, next) => {
    let topicName = req.params.name;
    res.send("get tweets about topic")
}

let getTweetsAboutMultipleTopics = (req, res, next) => {
    let topicName = req.params.name;
    res.send("get tweets about multiple topic")
}

let getTopTwitterNews = (req, res, next) => {
    res.send("get top twitter news")
}

let getCurrentTrendingTweets = (req, res, next) => {
    res.send("get current trending tweets")
}

let searchRecentTweetsAboutTopic = (req, res, next) => {
    let endpoint = "https://api.twitter.com/2/tweets/search/recent"
    let searchTerm = req.params.term;
    let focusedTopic = req.params.topic.toLowerCase();
    // let focusedTopicCapitalized = focusedTopic[0].toUpperCase()+focusedTopic.substr(1)

    // console.log(searchTerm, focusedTopic)

    const params = {
        // "query": "Womens league",
        "query": `${searchTerm} -is:retweet`,
        "user.fields": "created_at,description,name,username,public_metrics", // Edit optional query parameters here
        "tweet.fields": "author_id,context_annotations",
        "max_results": 11,
        "expansions": "attachments.media_keys",
        "media.fields": "url,preview_image_url",
    }
 
    getDataFromTwitter(endpoint, params, "v2RecentSearchJS").then(results => {
        let filtered = []

        // console.log(results, "results.includes<><>")

        results?.data?.forEach(item => {
            // console.log("chk4 here!!")
            if(item?.context_annotations?.length) {
                // console.log("chk3 here!!")

                item?.context_annotations?.forEach((elem, idx) => {
                    // console.log("chk2 here!!", elem.domain.name, elem.domain.name.toLowerCase(), elem.domain.name.toLowerCase().includes(focusedTopic),  focusedTopic)

                    if(elem.domain.name.toLowerCase().includes(focusedTopic) || elem.entity.name.toLowerCase().includes(focusedTopic)) {
                        // console.log("chk1 here!!", elem.domain.name)
                        let findIdx = filtered.findIndex(item2 => item2.postData.id === item.id)
                        let chkTxt = filtered.findIndex(item2 => item2.postData.text === item.text)

                        if(findIdx === -1 && chkTxt === -1) {
                            if(item?.attachments && results?.includes) {
                                let uRef = item.attachments.media_keys[0];
                                let urlObjFromIncludes = results.includes.media.filter(uObj => uObj.media_key === uRef)
                                filtered.push({postData: item, medias: urlObjFromIncludes}) 
                            } else {
                                filtered.push({postData: item})
                            }
                        }
                    }
                })
            } else {
                
                if(item?.context_annotations?.domain?.name.toLowerCase().includes(focusedTopic.toLowerCase())) {
                    filtered.push(item)
                }
            }
        })
        // console.log(filtered, "filtered!!")
        res.status(200).json({success: true, data: filtered})
    }).catch(err=>console.error(err))
}

let getSingleTweetData = (req, res, next) => {
    let endpoint = `https://api.twitter.com/2/tweets/${req.params.id}`
    let params = {
        "user.fields": "created_at,description,name,username", // Edit optional query parameters here
        "tweet.fields": "author_id,context_annotations",
        "expansions": "attachments.media_keys",
        "media.fields": "url,preview_image_url",
    }
}

let getUserAccountInfo = (req, res, next) => {
    let endpoint = `https://api.twitter.com/2/users/${req.params.id}`
    
    let params = {
        "user.fields": "profile_image_url,verified,created_at,public_metrics"
    }
    
    getDataFromTwitter(endpoint, params, "v2UserLookupJS")
    .then(result => {
        // console.log(result, "result!!")
        res.status(200).json({data: result.data, errors: []})
    }).catch(err => {
        console.error(err)
        res.status(402).json({data: {}, errors: err})
        return next(err)
    })
}

module.exports = {
    getUserAccountInfo,
    searchRecentTweetsAboutTopic,
    getTweetsFromAccount,
    getTweetsFromMultipleAccounts,
    getTweetsAboutTopic,
    getTweetsAboutMultipleTopics,
    getTopTwitterNews,
    getCurrentTrendingTweets
}