import { VerticalAlignTop } from '@mui/icons-material';
import { Box, Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import React, { useState } from 'react'

function DropdownMenu({ options }) {
    let [openMenuOptions, setOpenMenuOptions] = useState(false);
    const handleOpenMenuOptions = () => setOpenMenuOptions(true);
    const handleCloseMenuOptions = () => setOpenMenuOptions(false);
    let renderOptions = options?.map(item => <RenderMenuItem key={item.name} item={item} handleCloseMenuOptions={handleCloseMenuOptions} />);

    return (
        <Box>
            <Tooltip title="click to open menu">
                <IconButton onClick={handleOpenMenuOptions}><VerticalAlignTop /></IconButton>
            </Tooltip>
            <Menu
                open={openMenuOptions}
            >
                {renderOptions()}
            </Menu>
        </Box>
    )
}

const RenderMenuItem = ({ item, handleCloseMenuOptions }) => {
    return (
        <MenuItem onClick={handleCloseMenuOptions}>
            {item.name}
        </MenuItem>
    )
}

export default DropdownMenu