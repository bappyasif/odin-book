import { LanguageTwoTone } from '@mui/icons-material';
import { Card, CardContent, CardHeader, CardMedia, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useToFetchPostsFromNyTimes } from './hooks/useToFetchData'

function ContentsFromNyTimes() {
    // let { data } = useToFetchPostsFromNyTimes()

    return (
        <Container>
            ContentsFromNyTimes
            <RenderPopularPostsFromNyTimes />
            <RenderMostSharedPosts />
            {/* {data.length ? <RenderPopularPostsFromNyTimes dataset={data} /> : null} */}
        </Container>
    )
}

const RenderMostSharedPosts = () => {
    let [mostSharedPosts, setMostSharedPosts] = useState([]);

    let url = `https://api.nytimes.com/svc/mostpopular/v2/shared/1/facebook.json?api-key=${process.env.REACT_APP_NY_TIMES_API_KEY}`

    let { data } = useToFetchPostsFromNyTimes(url)

    useEffect(() => setMostSharedPosts(data), [data])

    let renderTwoPosts = () => mostSharedPosts.map((item, idx) => idx < 2 && <RenderData key={idx} assetId={item.asset_id} data={item} />)

    return (
        <>
            {mostSharedPosts.length ? renderTwoPosts() : null}
        </>
    )
}

const RenderPopularPostsFromNyTimes = () => {
    let [popularPosts, setPopularPosts] = useState([]);

    const url = `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${process.env.REACT_APP_NY_TIMES_API_KEY}`

    let { data } = useToFetchPostsFromNyTimes(url)

    useEffect(() => setPopularPosts(data), [data])

    let renderTwoPosts = () => popularPosts.map((item, idx) => idx < 2 && <RenderData key={idx} assetId={item.asset_id} data={item} />)

    return (
        <>
            {popularPosts.length ? renderTwoPosts() : null}
        </>
    )
}

const RenderData = ({ data }) => {
    return (
        <Card sx={{mb: 1.1, mt: 1.1, outline: "solid 1.1px red"}}>
            <RenderPostHeaderView data={data} />
            <RenderPostMediaView data={data} />
            <RenderPostContentView data={data} />
        </Card>
    )
}

const RenderPostMediaView = ({ data }) => {
    let getUrl = () => {
        let url = ""
        let metadataArr = data.media[0]["media-metadata"]
        url = metadataArr[metadataArr.length - 1].url
        return url;
    }
    return (
        <CardMedia
            component={"img"}
            height="350"
            image={getUrl()}
            sx={{ objectFit: "fill" }}
        />
    )
}

const RenderPostContentView = ({ data }) => {
    return (
        <CardContent>
            <Typography variant='h6'>{data.abstract}</Typography>
        </CardContent>
    )
}

const RenderPostHeaderView = ({ data }) => {
    return (
        <CardHeader
            title={<Typography variant='h2'>{data.title}</Typography>}
            subheader={
                <Stack sx={{ flexDirection: "row", gap: 2, alignItems: "center", justifyContent: "center" }}>
                    <Typography variant='body2'>Source: {data.source}</Typography>
                    <Typography variant='body2'>Section: {data.section}</Typography>
                    <Typography variant='body2'>{data.byline}</Typography>
                </Stack>
            }
            action={
                <Tooltip title="view in source site">
                    <IconButton>
                        <LanguageTwoTone />
                    </IconButton>
                </Tooltip>
            }
        >
        </CardHeader>
    )
}

export default ContentsFromNyTimes
/**
 * 
 const RenderPopularPostsFromNyTimes = ({ dataset }) => {
    let [popularPosts, setPopularPosts] = useState([]);
    let [randomPosts, setRandomPosts] = useState([]);

    const removeItemFromDataset = assetId => {
        setPopularPosts(prev => {
            let filtered = prev.filter(item => item.asset_id !== assetId)
            return filtered
        })
    }

    useEffect(() => {
        if (randomPosts.length < 2 && popularPosts.length) {
            let genRnd = Math.floor(Math.random() * popularPosts.length)
            setRandomPosts(prev => [...prev, popularPosts[genRnd]])
            removeItemFromDataset(popularPosts[genRnd]?.asset_id)
            // console.log(popularPosts, "popularPosts!!", genRnd, randomPosts)
        }
    }, [popularPosts, randomPosts])

    const url = `https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${process.env.REACT_APP_NY_TIMES_API_KEY}`

    let { data } = useToFetchPostsFromNyTimes(url)

    useEffect(() => setPopularPosts(data), [data])

    console.log(randomPosts, "popularPosts!!")

    // let renderTwoPosts = () => popularPosts.map((item, idx, arr) => idx < 2 && <RenderRandomlyChosenPostFromDataset key={idx} assetId={item.asset_id} dataset={arr} removeItemFromDataset={removeItemFromDataset} />)
    // let renderTwoPosts = () => popularPosts.map((item, idx) => idx < 2 && <RenderData key={idx} assetId={item.asset_id} data={item} removeItemFromDataset={removeItemFromDataset} />)
    let renderTwoPosts = () => randomPosts.map((item, idx) => <RenderData key={idx} assetId={item.asset_id} data={item} removeItemFromDataset={removeItemFromDataset} />)

    return (
        <>
            {popularPosts.length ? renderTwoPosts() : null}
            {/* {popularPosts.length ? renderTwoPosts() : null} /}
            {/* {popularPosts ? <CuratePopularPostFromDataset dataset={popularPosts} removeItemFromDataset={removeItemFromDataset} /> : null} /}
            {/* { popularPosts.length ? <RenderRandomlyChosenPostFromDataset dataset={popularPosts} removeItemFromDataset={removeItemFromDataset} /> : null}
            { popularPosts.length ? <RenderRandomlyChosenPostFromDataset dataset={popularPosts} removeItemFromDataset={removeItemFromDataset} /> : null} /}
            </>
            )
        }
 */


// const RenderRandomlyChosenPostFromDataset = ({ dataset, removeItemFromDataset, assetId }) => {
//     let [rndNum, setRndNum] = useState();
//     let [chosenContent, setChosenContent] = useState({})

//     useEffect(() => {
//         rndNum !== -1 && setChosenContent(dataset[rndNum])
//         rndNum !== -1 && removeItemFromDataset(dataset[rndNum]?.asset_id)
//         rndNum !== -1 && setRndNum(-1)
//     }, [rndNum])

//     useEffect(() => {
//         let genRnd = Math.floor(Math.random(dataset.length))
//         setRndNum(genRnd)
//         // setChosenContent({})
//     }, [assetId])

//     // useEffect(() => setChosenContent({}), [])

//     console.log("chosenContent", assetId)
//     return (
//         <Box>
//             <Typography>{chosenContent?.asset_id}</Typography>
//         </Box>
//     )
// }

// const CuratePopularPostFromDataset = ({ dataset, removeItemFromDataset }) => {


//     // let renderPost = () => chosenContent?.asset_id && <RenderRandomlyChosenPostFromDataset data={chosenContent} />
//     let renderPosts = () => dataset.map((item, idx) => idx < 2 && <RenderRandomlyChosenPostFromDataset data={chosenContent} />)

//     return (
//         <>
//             {renderPost()}
//         </>
//     )
// }