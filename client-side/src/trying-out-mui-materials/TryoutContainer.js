import React from 'react'
import CustomizingTheme from './CustomizingTheme'
import BasicCard, { RecipeReviewCard } from './UsingCard'
import UsingIcons from './UsingIcons'
import UsingLists from './UsingLists'
import UsingProgress from './UsingProgress'
import UsingSkeleton from './UsingSkeleton'
import UsingSx from './UsingSx'

function TryoutContainer() {
    return (
        <>
            <UsingSx />
            <CustomizingTheme />
            <UsingIcons />
            <UsingProgress />
            <BasicCard />
            <RecipeReviewCard />
            <UsingSkeleton />
            <UsingLists />
        </>
    )
}

export default TryoutContainer