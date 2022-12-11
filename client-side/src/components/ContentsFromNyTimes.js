import { LanguageTwoTone } from '@mui/icons-material';
import { Card, CardContent, CardHeader, CardMedia, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useToFetchPostsFromNyTimes } from './hooks/useToFetchData'

function ContentsFromNyTimes() {
    return (
        <Container>
            <RenderPopularPostsFromNyTimes />
            <RenderMostSharedPosts />
        </Container>
    )
}

const RenderMostSharedPosts = () => {
    let [mostSharedPosts, setMostSharedPosts] = useState([]);

    let url = `https://api.nytimes.com/svc/mostpopular/v2/shared/1/facebook.json?api-key=${process.env.REACT_APP_NY_TIMES_API_KEY}`

    let { data } = useToFetchPostsFromNyTimes(url)

    useEffect(() => setMostSharedPosts(data), [data])

    let renderTwoPosts = () => mostSharedPosts.map((item, idx) => idx < 2 && <RenderData key={idx} assetId={item.asset_id} data={item} />)

    console.log(mostSharedPosts, "mostSharedPosts")

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

    console.log(popularPosts, "popularPosts")

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
    let handleClick = ()  => {
        window.open(data.url, "_blank").focus()
    }
    
    return (
        <CardHeader
            sx={{
                textAlign: "right"
            }}
            title={<Typography variant='h2' textAlign={"justify"}>{data.title}</Typography>}
            subheader={
                <Stack sx={{ flexDirection: "row", gap: 2, alignItems: "center", justifyContent: "center" }}>
                    <Typography variant='p'>Source: {data.source}</Typography>
                    <Typography variant='body1'>Section: {data.section}</Typography>
                    <Typography variant='subtitle2'>{data.byline}</Typography>
                </Stack>
            }
            action={
                <Tooltip title="view in source site">
                    <IconButton onClick={handleClick}>
                        <LanguageTwoTone />
                    </IconButton>
                </Tooltip>
            }
        >
        </CardHeader>
    )
}

export default ContentsFromNyTimes