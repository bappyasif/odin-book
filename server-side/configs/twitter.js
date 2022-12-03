let { TwitterApi } = require("twitter-api-v2")
let needle = require("needle")

// twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN)

// let readOnlyClient = twitterClient.readOnly;

// readOnlyClient.v2.userByUserName("bappyasif").then(user => console.log(user)).catch(err=>console.error(err))


const endpointURL = "https://api.twitter.com/2/users/by?usernames="

async function getRequest() {

    // These are the parameters for the API request
    // specify User names to fetch, and any additional fields that are required
    // by default, only the User ID, name and user name are returned
    const params = {
        usernames: "bappyasif", // Edit usernames to look up
        "user.fields": "created_at,description", // Edit optional query parameters here
        "expansions": "pinned_tweet_id"
    }

    // this is the HTTP header that adds bearer token authentication
    const res = await needle('get', endpointURL, params, {
        headers: {
            "User-Agent": "v2UserLookupJS",
            "authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
        }
    })

    if (res.body) {
        return res.body;
    } else {
        throw new Error('Unsuccessful request')
    }
}

getRequest().then(resp => console.dir(resp, {depth: null})).catch(err=>console.error(err))

// (async () => {

//     try {
//         // Make request
//         const response = await getRequest();
//         console.dir(response, {
//             depth: null
//         });

//     } catch (e) {
//         console.log(e);
//         process.exit(-1);
//     }
//     process.exit();
// })();