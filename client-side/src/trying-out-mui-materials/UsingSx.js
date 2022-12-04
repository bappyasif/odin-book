import React from 'react'
import { Button, Stack } from "@mui/material"
import { TabElement } from '../components/MuiElements'

function UsingSx() {
  let test = true
  return (
    <>
      {/* because of stack both button is getting padding spacing due to responsive wrapper this Stack is */}
      <Stack spacing={2} direction={"row"}>
        <Button
          variant='outlined'
          sx={{
            width: "110px",
            padding: 11,
            border: 4,
            m: 2,
            borderColor: "primary.light",
            // global class specific to button root only
            "&.Mui.Button-root": { height: "110px" }
          }}>Button 01</Button>
        <Button variant="contained">Button 02</Button>
        {/* array values for sx */}
        <Button
          sx={[
            {
              // depending on screen size width will of this button will also change responsively
              width: {
                xs: 101,
                sm: 202,
                md: 303,
                lg: 404,
                xl: 505
              },
              border: 6,
              borderColor: "secondary.main"
            },
            test && {
              border: 6,
              borderColor: "secondary.light"
            }
          ]}
          variant="contained"
        >Button 03</Button>
      </Stack>
      <TabElement className={"nav-item"} labelText={"Login"} path={"login"} />
      <Button sx={{ width: "110px", padding: 11 }}>This is a Button</Button>
      <Button variant='contained' sx={{ border: 2, color: "error" }}>This is a Button</Button>
    </>
  )
}

export default UsingSx