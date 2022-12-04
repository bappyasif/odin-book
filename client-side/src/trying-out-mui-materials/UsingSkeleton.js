import { MoreHorizRounded, MoreVertOutlined } from '@mui/icons-material';
import { Avatar, Card, CardContent, CardHeader, CardMedia, IconButton, Skeleton, Typography } from '@mui/material'
import React from 'react'

function UsingSkeleton() {
    let loading = false;
    return (
        <>
            {/* For variant="text", adjust the height via font-size */}
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

            {/* For other variants, adjust the size with `width` and `height` */}
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={210} height={60} />
            <Skeleton variant="rounded" width={210} height={60} />

            {/* animations */}
            <>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
            </>

            {/* within card headers */}
            <>
                <Card sx={{ maxWidth: '404px', m: 2, p: 2 }}>
                    <CardHeader
                        avatar={
                            loading
                                ?
                                <Skeleton animation="wave" variant='circular' width={"40px"} height="40px" />
                                :
                                <Avatar
                                    alt='Ted Talk'
                                    src='https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg'
                                />
                        }
                        action={
                            loading
                                ?
                                null
                                :
                                (
                                    <IconButton>
                                        <MoreVertOutlined />
                                        <MoreHorizRounded />
                                    </IconButton>
                                )
                        }
                        title={
                            loading = true
                                ?
                                <Skeleton
                                    animation="wave"
                                    height={11}
                                    width={"80%"}
                                    style={{ marginBottom: 0 }}
                                />
                                :
                                "TedTalk"
                        }
                        subheader={
                            loading
                                ?
                                <Skeleton animation="wave" height={11} width="81%" />
                                :
                                "22 hours"
                        }
                    />
                    {
                        loading = true
                            ?
                            <Skeleton variant='rectangular' animation={"wave"} sx={{ height: 180 }} />
                            :
                            <CardMedia
                                component={"img"}
                                height={130}
                                image={"https://pi.tedcdn.com/r/talkstar-photos.s3.amazonaws.com/uploads/72bda89f-9bbf-4685-910a-2f151c4f3a8a/NicolaSturgeon_2019T-embed.jpg?w=512"}
                                alt="Nicola Sturgeon on a TED talk stage"
                            />
                    }
                    <CardContent>
                        {
                            loading = true
                                ?
                                <>
                                    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                                    <Skeleton animation="wave" height={10} width="80%" />
                                    <Typography variant="h1">{loading ? <Skeleton /> : 'h1'}</Typography>
                                </>
                                :
                                (
                                    <Typography variant='body2' color={"text.secondary"} component={"p"}>
                                        {
                                            "Why First Minister of Scotland Nicola Sturgeon thinks GDP is the wrong measure of a country's success:"
                                        }
                                    </Typography>
                                )}
                    </CardContent>
                </Card>
            </>
        </>
    )
}

export default UsingSkeleton