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

export default useToFetchUserActionSpecificPostData