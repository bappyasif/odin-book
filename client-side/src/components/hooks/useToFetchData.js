import React, { useContext, useEffect, useState } from 'react'
import { AppContexts } from '../../App';
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

    return { postsData }
}

export let useToFetchPostsFromNyTimes = (url) => {
    let [data, setData] = useState([])

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
        }
    }, [data, randomPosts])

    const fetchData = () => {
        fetch(url)
            .then(resp => resp.json())
            .catch(err => console.log("response error", err))
            .then(dataset => {
                if (dataset.results) {
                    let data = dataset.results
                    let filtered = data.filter(item => item.media.length);
                    setData(filtered)
                } else if (dataset.response.docs) {
                    let tempData = [];
                    console.log("still!!")
                    let data = dataset.response.docs
                    data.forEach(dataItem => {
                        let chkDuplicates = tempData.findIndex(article => article.abstract === dataItem.abstract)
                        chkDuplicates === -1 && tempData.push(dataItem)
                    })
                    setData(tempData)
                }
                let data = dataset.results ? dataset.results : dataset.response.docs
                // console.log(data, "dataset", dataset, data?.asset_id)

                // let filtered = data.filter(item => item.media.length);
                // setData(filtered)
                // console.log(filtered, "filtered")

                // let filtered = [];
                // data.forEach(item => {
                //     console.log(item, item.media.length)
                //     if(item?.media.length) {
                //         filtered.push(item)
                //     } else {
                // // let tempData = [];
                // console.log("still!!")
                // let chkDuplicates = filtered.findIndex(article => article.abstract === item.abstract)
                // chkDuplicates === -1 && filtered.push(item)
                //     }
                // })

                // setData(filtered)

                // if (data?.asset_id) {
                //     // let filtered = data?.filter(item => (item.media?.length))
                //     let filtered = data?.map(item => item.media.length ? item : false).filter(item => item)
                //     console.log(filtered, "filtered")
                //     setData(filtered?.length ? filtered : [])
                // } else {
                //     let tempData = [];
                //     data.forEach(item => {
                //         let chkDuplicates = tempData.findIndex(article => article.abstract === item.abstract)
                //         chkDuplicates === -1 && tempData.push(item)
                //     })

                //     console.log("why?!!!")
                //     setData(tempData)
                //     // setData(data)
                // }
            })
            .catch(err => console.log("somethings wrong!!", err, url))
    }

    useEffect(() => {
        fetchData()
    }, [])

    return { data: randomPosts }
}

export const useToFetchSearchedTermedTwitterData = (searchKeyword) => {
    let [dataset, setDataset] = useState({});

    let appCtx = useContext(AppContexts);

    let handleDataset = result => {
        let filtered = []
        // inserting all media attachments to match data rendering scheme
        filtered.push(result.data.data[0])
        // making sure there is no duplicates in dataset
        result.data.data.forEach(item => {
            let chkIdx = filtered.findIndex(tweetItem => (tweetItem.id === item.id))
            let chkAuthor = filtered.findIndex(tweetItem => (tweetItem.author_id === item.author_id))
            // chkIdx === -1 && chkAuthor === -1 && item.media && filtered.push(item)
            // chkIdx === -1 && item.media && filtered.push(item)
            // chkIdx === -1 && filtered.push(item)
            chkIdx === -1 && chkAuthor === -1 && filtered.push(item)
        })

        setDataset(filtered)
    }

    let url = `${appCtx.baseUrl}/twitter/search/${searchKeyword}`

    useEffect(() => {
        readDataFromServer(url, handleDataset)
    }, [url])

    // console.log(searchKeyword, dataset, "twitter....")

    return { dataset }
}

export default useToFetchUserActionSpecificPostData