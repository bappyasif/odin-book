import { AppRegistrationTwoTone } from '@mui/icons-material';
import { Button, FormControl, Input, InputLabel, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { AppContexts } from '../../App';
import { VisualizeWordCountProgress } from '../CreatePost';
import { FieldsetElement, FormElement, InputElement, LabelElement, LegendElement, SubmitButton } from '../FormElements'
import { H1Element, WrapperDiv } from '../GeneralElements'
import ShowErrors from '../ShowErrors';
import { sendDataToServer } from '../utils';
import { ShowDataProcessingLoaders } from './LoginForm';

function RegisterUser({ handleData }) {
    let [errors, setErrors] = useState([]);
    let [formData, setFormData] = useState({});
    let [processingRequest, setProcessingRequest] = useState(null);

    let navigate = useNavigate()

    const enpoint = useContext(AppContexts)

    let handleChange = (evt, elm) => setFormData(prev => ({ ...prev, [elm]: evt.target.value }))

    let handleError = data => {
        setErrors(data.errors)
        setProcessingRequest("error");
        let timer = setTimeout(() => {
            setProcessingRequest("")
            if (timer >= 1700) clearTimeout(timer)
        }, 1700)
    }

    let updateData = result => {
        setProcessingRequest("success");
        handleData(result)
        let timer = setTimeout(() => {
            navigate(result.user?.topics.length < 4 ? "/choose-topics" : "/");

            if (timer >= 1100) clearTimeout(timer)
        }, 1100)
    }

    let handleSubmit = evt => {
        evt.preventDefault();
        setProcessingRequest("loading");
        let timer = setTimeout(() => {
            sendDataToServer(enpoint.baseUrl + "/register", formData, handleError, updateData)
            if (timer >= 1700) clearTimeout(timer)
        }, 1700)
    }

    let renderFieldsets = () => createFormWithThese.map(data => <RenderFieldset key={data.id} data={data} handleChange={handleChange} />)

    return (
        <WrapperDiv className={"register-user"}>
            <ShowDataProcessingLoaders processingRequest={processingRequest} />
            <H1Element value={"Register User"} />

            {/* {errors?.length ? <ShowErrors errors={errors} /> : null} */}

            <FormElement handleSubmit={handleSubmit}>
                <LegendElement text={"Please enter all required fileds data(denoted by * next to them)"} />
                <Stack
                    sx={{
                        mt: 1.5,
                        gap: .6,
                        alignItems: "center",
                        mb: 2
                    }}
                >
                    {renderFieldsets()}
                </Stack>
                <Button type='submit' variant='contained' startIcon={<AppRegistrationTwoTone />}>
                    <Typography variant='h6'>Register</Typography>
                </Button>
            </FormElement>
            {errors?.length ? <ShowErrors errors={errors} /> : null}
        </WrapperDiv>
    )
}

let RenderFieldset = ({ data, handleChange }) => {
    let { id, labelText, type, placeholder, required } = { ...data }
    let [userInput, setUserInput] = useState(null);
    let [maxLimit, setMaxLimit] = useState()

    const handleUserInputChange = evt => {
        let currentLength = evt.target.value.length
        
        if (
            id === "fullname" && currentLength <= maxLimit
            ||
            id === "email" && currentLength <= maxLimit
            ||
            id === "password" && currentLength <= maxLimit
            ||
            id === "confirm" && currentLength <= maxLimit
        ) {
            setUserInput(evt.target.value)
            handleChange(evt, id)
        } else {
            // let maxLimit = id === "fullName" ? 72 : id === "email" ? 45 : 89;
            alert(`${id} has exceeded its maximum limit of ${maxLimit}`)
        }
    }

    useEffect(() => {
        // console.log(id, "regiuster ids")
        let maxLimit = id === "fullname" ? 72 : id === "email" ? 45 : 89;
        setMaxLimit(maxLimit)
    }, [])

    return (
        <FormControl sx={{position: "relative"}}>
            <InputLabel variant='filled' htmlFor={id}>{labelText}</InputLabel>
            <Input
                size='xl'
                id={id}
                type={type}
                placeholder={placeholder}
                required={required}
                onChange={handleUserInputChange}
            // onChange={e => handleChange(e, id)}
            />
            <VisualizeWordCountProgress topPlacingUnits={"14.1px"} maxLimit={maxLimit} smallerSize={true} textContent={userInput} forRegister={true} />
        </FormControl>
    )
}

let createFormWithThese = [
    {
        id: "fullname",
        labelText: "*FullName: ",
        type: "text",
        placeholder: "Enter Your Full Name",
        required: true
    },
    {
        id: "email",
        labelText: "*Email: ",
        type: "email",
        placeholder: "Enter Your Email Here",
        required: true
    },
    {
        id: "password",
        labelText: "*Password: ",
        type: "password",
        placeholder: "Enter Your Password Here",
        required: true
    },
    {
        id: "confirm",
        labelText: "*Confirm Password: ",
        type: "password",
        placeholder: "Retype Your Password Here",
        required: true
    }
]

export default RegisterUser