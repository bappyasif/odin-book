import { DeleteForeverOutlined, DeleteForeverSharp, DeleteForeverTwoTone } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
import React from 'react'

function UsingIcons() {
  return (
    <div>
        <Typography variant='h1'>Using Icons</Typography>
        <DeleteForeverSharp color='secondary.main' fontSize="large" />
        <DeleteForeverTwoTone fontSize='small' sx={{color: "secondary.light"}} />
        {/* to get feedback as gets clicked we will have to use IconButton instead */}
        <IconButton size='small' color='primary'>
            <DeleteForeverOutlined fontSize="large" sx={{color: "secondary.dark"}} />
            <DeleteForeverOutlined fontSize="inherit" sx={{color: "secondary.main"}} />
        </IconButton>
    </div>
  )
}

export default UsingIcons