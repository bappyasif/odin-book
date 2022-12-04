import { MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BoxElement, EverybodyElement, FormControlElement, FriendsElement, InputLabelElement, MuiBoxElement, StackElement, TypographyElement } from './MuiElements'

function ChoosePrivacy({ handleValue, currentElement }) {
    let [settingSelected, setSettingSelected] = useState('')

    let handleSettingSelected = event => {
        setSettingSelected(event.target.value)
    }

    let renderSettings = () => privacyIcons.map(item => <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>)

    let updatePrivacy = () => {
         // uploading value into state
         handleValue(null, currentElement, settingSelected);
         // changing current elemnt to something which has no actionable components attached to it
         handleValue(null, "choose again", "");
    }

    useEffect(() => {
        settingSelected && updatePrivacy()
    }, [settingSelected])

    return (
        <BoxElement>
            {settingSelected && <ShowRespectiveIcon privacy={settingSelected} />}
            <FormControlElement variant="filled" styles={{ m: 1, minWidth: 220 }}>
                <InputLabelElement hFor={"select-elem"} text={"Select Privacy"} />
                <Select
                    labelId="select-elem"
                    id="select-elem"
                    value={settingSelected}
                    onChange={handleSettingSelected}
                    label="Select Privacy"
                >
                    <MenuItem value="">None</MenuItem>
                    {renderSettings()}
                </Select>
            </FormControlElement>
        </BoxElement>
    )
}

export let ShowRespectiveIcon = ({ privacy, order }) => {
    let icon = null;
    let text = "";
    if (privacy === "Everybody") {
        icon = <EverybodyElement />
        text = "Everybody Can Interact With This Post"
    } else if (privacy === "Friends") {
        icon = <FriendsElement />
        text = "Only Friends Can Interact With This Post"
    } else if (privacy === "") {
        icon = <EverybodyElement />
        text = "Everybody Can Interact With This Post"
    }

    return (
        <BoxElement order={order}>
            <TypographyElement text={"Privacy : "} type={"h4"} />
            <MuiBoxElement direction={"row"}>
                <TypographyElement text={text || "Everybody"} type={"h6"} /> <span>{icon}</span>
            </MuiBoxElement>
        </BoxElement>
    )
}

// dataset for privacy settings
let privacyIcons = [
    { name: "Everybody", icon: <EverybodyElement /> },
    { name: "Friends", icon: <FriendsElement /> }
]

export default ChoosePrivacy