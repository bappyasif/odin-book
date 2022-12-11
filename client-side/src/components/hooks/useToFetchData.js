import React, { useEffect, useState } from 'react'
import { readDataFromServer } from '../utils';

function useToFetchUserActionSpecificPostData(appCtx, type) {
    let [postsData, setPostsData] = useState([]);

    let handlePostsData = (result) => {
        setPostsData(result.data.data)
    }

    let getAllPostsForThisUser = () => {
        let url = `${appCtx.baseUrl}/posts/${appCtx.user._id}/specific/${type ? type : ""}`
        readDataFromServer(url, handlePostsData)
    }

    useEffect(() => {
        getAllPostsForThisUser()
    }, [])

    console.log(postsData, "!!")
    // return postsData.length ? postsData : [];
    // return postsData.length && postsData;
    return {postsData}
}

export let useToFetchPostsFromNyTimes = (url) => {
    let [data, setData] = useState([])
    // const appCtx = useContext(AppContexts);
    
    let [randomPosts, setRandomPosts] = useState([]);

    const removeItemFromDataset = assetId => {
        setData(prev => {
            let filtered = prev.filter(item => item.asset_id !== assetId)
            return filtered
        })
    }

    useEffect(() => {
        if (randomPosts.length < 2 && data.length) {
            let genRnd = Math.floor(Math.random() * data.length)
            setRandomPosts(prev => [...prev, data[genRnd]])
            removeItemFromDataset(data[genRnd]?.asset_id)
            // console.log(popularPosts, "popularPosts!!", genRnd, randomPosts)
        }
    }, [data, randomPosts])

    const fetchData = () => {
        // let url = `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${process.env.REACT_APP_NY_TIMES_API_KEY}`
        fetch(url)
        .then(resp => resp.json())
        .catch(err => console.log("response error", err))
        .then(dataset => {
            // console.log(dataset, "nytimes");
            setData(dataset.results)
        })
        .catch(err => console.log("somethings wrong!!", err))
    }

    useEffect(() => {
        fetchData()
    }, [])

    // return {data}
    return {data: randomPosts}
}

export default useToFetchUserActionSpecificPostData