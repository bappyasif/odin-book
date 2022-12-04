import React, { useContext, useEffect, useState } from 'react'
import { FieldsetElement, FormElement, InputElement, LabelElement, LegendElement, SubmitButton } from '../FormElements'
import { H1Element, WrapperDiv } from '../GeneralElements'
import { sendDataToServer } from '../utils';
import { AppContexts } from "../../App"
import ShowErrors from '../ShowErrors';
import { Box, Button, Icon, IconButton, Paper, Stack, Typography } from '@mui/material';
import { AccountCircleTwoTone, Facebook, GitHub, Google, LinkedIn, Twitter } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function LoginForm({ handleData }) {
    let [errors, setErrors] = useState([]);
    let [formData, setFormData] = useState({});

    const navigate = useNavigate()
    const enpoint = useContext(AppContexts)


    let handleChange = (evt, elm) => setFormData(prev => ({ ...prev, [elm]: evt.target.value }))

    let handleError = data => setErrors(data.errors);

    let updateData = result => {
        handleData(result)
        // navigate("/");
        console.log(result, "result!!")
        result.user?.topics.length < 4 ? navigate("/choose-topics") : navigate("/");
    }

    let handleSubmit = evt => {
        evt.preventDefault();
        sendDataToServer(enpoint.baseUrl + "/login", formData, handleError, updateData)
    }
    // console.log(formData, "formData!!");
    // console.log(errors, "errors!!")

    return (
        <Box
            sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
        >
            <GuestUsers setFormData={setFormData} handleSubmit={handleSubmit} />
            <WrapperDiv className="login-form">
                <H1Element value={"Login Form"} />

                {errors?.length ? <ShowErrors errors={errors} /> : null}

                <FormElement handleSubmit={handleSubmit}>
                    <LegendElement text={"Enter your registered email and password"} />
                    <FieldsetElement>
                        <LabelElement forVal={"email"} text="Email: " />
                        <InputElement type={"email"} id={"email"} name="email" value={"t@e.st"} handleChange={handleChange} text="enter email (e.g. t@e.st)" required={true} />
                    </FieldsetElement>
                    <FieldsetElement>
                        <LabelElement forVal={"password"} text="Password: " />
                        <InputElement type={"password"} id={"password"} name="password" value={"e.g.: p1a2s3s4w5o6r7d8"} handleChange={handleChange} text="enter password (e.g.: p1a2s3s4w5o6r7d8)" required={true} />
                    </FieldsetElement>
                    <SubmitButton text={"Login"} />
                </FormElement>
            </WrapperDiv>

            <ThirdPartyLoginOutlets />

        </Box>
    )
}

let ThirdPartyLoginOutlets = () => {
    let renderLoginOutlets = () => loginOutlets.map(item => <RenderLoginOutlet key={item.name} item={item} />)

    return (
        <Paper sx={{ ml: 2, mt: 1, borderRadius: 2 }}>
            <Typography variant='h2'>Login With</Typography>
            {renderLoginOutlets()}
        </Paper>
    )
}

let RenderLoginOutlet = ({ item }) => {
    const navigate = useNavigate()

    let handleClick = evt => {
        let url = ''
        if (item.name === "Google") {
            url = `http://localhost:3000/auth/google`
        } else if (item.name === "Facebook") {
            url = `http://localhost:3000/auth/facebook`
        } else if (item.name === "Github") {
            url = `http://localhost:3000/auth/github`
        } else if (item.name === "Twitter") {
            url = `http://localhost:3000/auth/twitter`
        }
        loginPrompt(url, navigate)
    }

    return (
        <Stack
            onClick={handleClick}
            sx={{ alignItems: "center", flexDirection: "row", justifyContent: "left", m: 1, p: 1, pl: 4, pr: 4, outline: "solid .2px", borderRadius: 11, cursor: "pointer" }}
        >
            <IconButton>
                <Icon sx={{ m: .4, color: "skyblue", textAlign: "left" }}>
                    {item.icon}
                </Icon>
            </IconButton>
            <Typography variant='h4' sx={{ textAlign: "center", ml: 4 }}>{item.name}</Typography>
        </Stack>
    )
}

let GuestUsers = ({ handleSubmit, setFormData }) => {
    let guestUsers = [{ name: "Guest Een" }, { name: "Guest Twee" }]
    let renderUsers = () => guestUsers.map(user => <RenderGuestUser key={user.name} item={user} handleSubmit={handleSubmit} setFormData={setFormData} />)
    return (
        <Box>
            {renderUsers()}
        </Box>
    )
}

let RenderGuestUser = ({ item, handleSubmit, setFormData }) => {
    let [dataReady, setDataReady] = useState(false);

    let handleClick = (e) => {
        setFormData({ email: `guest@${item.name === "Guest Een" ? "een" : "twee"}.com`, password: `g${item.name === "Guest Een" ? "een" : "twee"}` })
        setDataReady(e);
    }
    
    useEffect(() => {
        dataReady && handleSubmit(dataReady)
    }, [dataReady])

    return (
        <IconButton onClick={handleClick}>
            <Button>
                <AccountCircleTwoTone />
                <Typography>{item.name}</Typography>
            </Button>
            {/* <Typography>{item.name}</Typography> */}
        </IconButton>
    )
}

let loginPrompt = (url, navigate) => {
    const newWindow = window.open(url, "_blank", "width=500, height=500")

    let timer = 0;

    if (newWindow) {
        timer = setInterval(() => {
            if (newWindow.closed) {
                if (timer) clearInterval(timer)
                navigate("/")
            }
        }, 1001)
    }
}

let loginOutlets = [
    {
        name: "Google",
        icon: <Google />
    },
    {
        name: "Facebook",
        icon: <Facebook />
    },
    {
        name: "Github",
        icon: <GitHub />
    },
    {
        name: "Twitter",
        icon: <Twitter />
    }
]

export default LoginForm