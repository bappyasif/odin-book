const { body, validationResult, check } = require("express-validator");
const async = require("async");
const Post = require("../models/post");
const User = require("../models/user");

const getAllPosts = (req, res, next) => {
    let userId = req.params.userId;
    // console.log(userId, "userId!!")

    Post.find({ userId: userId })
        .then(results => {
            // console.log(results, "!!<<results>>!!")
            res.status(200).json({ success: true, data: results })
        }).catch(err => next(err))
}

const getAllPrivatePostsFromFriends = (req, res, next) => {
    let userId = req.params.userId;
    console.log(userId, "allprivates")
    let foundPosts = [];

    User.findOne({_id: userId})
        .then((dataset) => {

            if(dataset.friends.length) {
                let allPromises = dataset.friends.map(val => {
                    return Post.find({userId: val, privacy: "Friends"})
                })
                Promise.all(allPromises).then(results => {
                    // console.log(results, "results")
                    // results.forEach(item => foundPosts.push(item))
                    results.forEach(item => item.length && foundPosts.push(...item))
                    // res.status(200).json({status: "success", data: foundPosts})
                }).catch(err => next(err))
                .then(() => {
                    // console.log(foundPosts, "foundPosts!!")
                    res.status(200).json({status: "success", data: foundPosts})
                })
                // console.log(foundPosts, "foundPosts!!")
            }
        }).catch(err => next(err))
}

// const getAllPrivatePostsFromFriends = (req, res, next) => {
//     let userId = req.params.userId;
//     console.log(userId, "allprivates")
//     let foundPosts = [];

//     User.findOne({ _id: userId })
//         .then((dataset) => {
//             if (dataset.friends.length) {
//                 dataset.friends.forEach(val => {
//                     Post.find({ userId: val, privacy: "Friends" })
//                         .then(result => {
//                             result.forEach(postItem => {
//                                 foundPosts.push(postItem)
//                             })
//                             // console.log(result, "friends post")
//                         }).catch(err => next(err))
//                 })
//             }
//         }).catch(err => next(err))
//         .then(() => {
//             res.status(200).json({status: "success", data: foundPosts})
//         })
// }

// const getAllPrivatePostsFromFriends = (req, res, next) => {
//     let userId = req.params.userId;
//     console.log(userId, "allprivates")
//     let foundPosts = [];

//     let postsPromises = User.findOne({_id: userId})
//         .then((dataset) => {

//             if(dataset.friends.length) {

//                 let friendPostsPomises = dataset.friends.map(val => {
//                     Post.find({userId: val, privacy: "Friends"})
//                 })

//                 return Promise.all(friendPostsPomises)
//                 // console.log(foundPosts, "foundPosts!!")
//             }
//         }).catch(err => next(err))

//         postsPromises.then(results => {
//             console.log(results, "results!!")

//             res.status(200).json({status: "success", data: foundPosts})
//         })
// }

// const getAllPrivatePostsFromFriends = (req, res, next) => {
//     let userId = req.params.userId;

//     console.log(userId, "allprivates")

//     let foundPosts = [];

//     User.findOne({_id: userId})
//         .then((dataset) => {
//             if(dataset.friends.length) {

//                 dataset.friends.forEach(val => {
//                     async.parallel(
//                         {
//                             friendPosts(cb) {
//                                 Post.find({userId: val, privacy: "Friends"}).exec(cb)
//                             }
//                         },

//                         (err, results) => {
//                             if(err) return next(err)

//                             if(results.friendPosts.length) {
//                                 foundPosts.push(...results.friendPosts)
//                             }

//                             console.log(foundPosts, "!!33foundPosts!!")

//                             // console.log(results, "Friends!!")
//                             // res.status(200).json({status: "success", data: foundPosts})
//                         }
//                     )
//                     // Post.find({userId: val})
//                     //     .then(result => {
//                     //         result.forEach(postItem =>  {
//                     //             if(postItem.privacy === "Friends") {
//                     //                 console.log(postItem, "PostItem")
//                     //                 foundPosts.push(postItem)
//                     //             }
//                     //         })
//                     //     }).catch(err => next(err))
//                 })
//             }
//             console.log(foundPosts, "foundPosts!!")
//             res.status(200).json({status: "success", data: foundPosts})
//         }).catch(err => next(err))
//         console.log(foundPosts, "!!22foundPosts!!")
// }

// const getAllPrivatePostsFromFriends = (req, res, next) => {
//     let userId = req.params.userId;
//     console.log(userId, "allprivates")
//     let foundPosts = [];

//     User.findOne({_id: userId})
//         .then((dataset) => {
//             if(dataset.friends.length) {
//                 dataset.friends.forEach(val => {
//                     Post.find({userId: val})
//                         .then(result => {
//                             result.forEach(postItem =>  {
//                                 if(postItem.privacy === "Friends") {
//                                     console.log(postItem, "PostItem")
//                                     foundPosts.push(postItem)
//                                 }
//                             })
//                             // console.log(result, "friends post")
//                         }).catch(err => next(err))
//                         // .finally(() => res.status(200).json({status: "success", data: foundPosts}))
//                 })
//                 // res.status(200).json({status: "success", data: foundPosts})
//             }
//             res.status(200).json({status: "success", data: foundPosts})
//         }).catch(err => next(err))
//         // .finally(() => res.status(200).json({status: "success", data: foundPosts}))
//     // res.status(200).json({status: "success", data: foundPosts})
// }

getAllSpecificActionTypesPosts = (req, res, next) => {
    let userId = req.params.userId;
    let data = req.body;
    let postType = req.params.type;

    console.log(postType, "postType");

    Post.find({ userId: userId })
        .then(results => {
            let filteredPosts = [];

            results.forEach(item => {
                item.usersEngagged.forEach(vals => {
                    if (Object.keys(vals)[0] === userId) {
                        Object.values(vals)[0][postType] ? filteredPosts.push(item) : null
                    }
                })

            })

            // console.log(filteredPosts, "filtered posts!!")
            res.status(200).json({ success: true, data: filteredPosts })
        }).catch(err => next(err))
}

const getAllPostsWithPublicPrivacy = (req, res, next) => {
    async.parallel(
        {
            emptyPrivacy(cb) {
                Post.find({ privacy: "" }).exec(cb)
            },

            everybodyPrivacy(cb) {
                Post.find({ privacy: "Everybody" }).exec(cb)
            }
        },

        (err, results) => {
            if (err) return next(err);
            // console.log(results.emptyPrivacy, "!!<<results>>!!")
            res.status(200).json({ success: true, data: [...results.emptyPrivacy, ...results.everybodyPrivacy] })
        }
    )
}

const getSoloPost = (req, res, next) => {
    // console.log(req.params.postId, "req.params.postId")
    Post.findById({ _id: req.params.postId })
        .then(result => {
            res.status(200).json({ success: true, data: result })
        }).catch(err => next(err))
}

const createNewPost = [
    body("body", "post can not be left empty")
        .trim().isLength({ min: 1 }),
    body("body", "post needs to be at least 4 characters long")
        .trim().isLength({ min: 4 }),
    body("Image", "image url needs to be a proper url")
        .isURL().optional(),
    // .trim().escape(),
    body("Video", "video url needs to be a proper url")
        .isURL().optional(),
    // .trim().escape(),
    body("Gif", "gif needs to be an array of gif object")
        .isObject().optional(),
    check("Poll", "poll needs to be an array of object")
        .isObject().optional(),
    body("Privacy", "Privacy needs to be a string")
        .trim().isString().escape(),

    (req, res, next) => {
        console.log(req.body, "req.body!!", req.params.userId)

        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(402).json({ success: false, errors: errors.array() })
        }

        // data is sanitized and validated for to be saved in databse
        let newPost = new Post({
            body: req.body.body,
            userId: req.params.userId,
            created: new Date().toISOString(),
            privacy: req.body.Privacy,
            imageUrl: req.body.Image,
            videoUrl: req.body.Video,
            poll: req.body.Poll,
            gif: req.body.Gif
        })

        newPost.save((err, post) => {
            if (err) return next(err)

            // save successfull, so lets response bvack to user about this
            console.log("post saved!!")
            res.status(200).json({ success: true, post: post })
        })
    }
]

const updateSoloPost = (req, res, next) => {
    let data = req.body;

    Post.findOne({ _id: req.params.postId })
        .then(currentPost => {
            // updating post with data sent to server from client
            currentPost.likesCount = data.Like,
                currentPost.dislikesCount = data.Dislike,
                currentPost.loveCount = data.Love,
                currentPost.shareCount = data.Share
            // currentPost.usersEngagged.push()
            console.log(currentPost, "currentPost!!")

            // updating post with latest post data
            Post.findByIdAndUpdate(currentPost._id, currentPost, {})
                .then((currPost) => {
                    console.log("data updated!!", currPost)
                    res.status(200).json({ success: true, posts: [] })
                })
                .catch(err => next(err))
        }).catch(err => next(err))
}

const updateSoloPostWithSpecificData = (req, res, next) => {
    let dataBody = req.body;
    let postId = req.params.postId;
    console.log(dataBody, "dataBody!!")
    Post.findOne({ _id: postId })
        .then(currentPost => {
            currentPost[dataBody.propKey] = dataBody.propValue
            Post.findByIdAndUpdate(currentPost._id, currentPost, {})
                .then(updatedPost => {
                    console.log(updatedPost, "updatedPost!!", postId, dataBody.propValue, dataBody.propKey)
                    res.status(200).json({ success: true, posts: [] })
                }).catch(err => next(err))
        }).catch(err => next(err))
}

const updateSoloPostWithUserEngagements = (req, res, next) => {
    let data = req.body;
    console.log(data, "!!", req.params.postId, req.params.interactingUserId, data.currentUserCounts)

    Post.findOne({ _id: req.params.postId })
        .then(currentPost => {
            // updating post with data sent to server from client

            currentPost.likesCount = data.Like;

            currentPost.dislikesCount = data.Dislike;

            currentPost.loveCount = data.Love

            currentPost.shareCount = data.Share

            currentPost.commentsCount = data.Comment

            let findIdx = currentPost.usersEngagged?.findIndex(item => Object.keys(item)[0] === req.params.interactingUserId)

            if (findIdx === -1) {
                console.log("check notfound!!")
                currentPost.usersEngagged.push({ [req.params.interactingUserId]: data.currentUserCounts })
            } else {
                console.log("check found!!")
                currentPost.usersEngagged[findIdx] = { [req.params.interactingUserId]: data.currentUserCounts }
            }

            // if(data.Share) {
            //     currentPost.includedSharedPostId = req.params.postId;
            // }

            console.log(currentPost, "currentPost!!")

            // updating post with latest post data
            Post.findByIdAndUpdate(currentPost._id, currentPost, {})
                .then((currPost) => {
                    console.log("data updated!!", currPost)
                    res.status(200).json({ success: true, posts: [] })
                })
                .catch(err => next(err))
        }).catch(err => next(err))
}

const deleteSoloPost = (req, res, next) => {
    console.log(req.params.postId, req.body.postId)
    // res.status(200).json({ success: true, data: "post is now deleted" })
    Post.findByIdAndDelete({ _id: req.params.postId })
        .then(() => {
            console.log("post is now deleted");
            res.status(200).json({ success: true, data: "post is now deleted" })
        })
        .catch(err => next(err))
}

module.exports = {
    getAllPosts,
    getSoloPost,
    createNewPost,
    updateSoloPost,
    deleteSoloPost,
    updateSoloPostWithUserEngagements,
    getAllPostsWithPublicPrivacy,
    updateSoloPostWithSpecificData,
    getAllSpecificActionTypesPosts,
    getAllPrivatePostsFromFriends
}