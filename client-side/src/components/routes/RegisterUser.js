import React, { useContext, useState } from 'react'
import {useNavigate} from "react-router-dom"
import { AppContexts } from '../../App';
import { FieldsetElement, FormElement, InputElement, LabelElement, LegendElement, SubmitButton } from '../FormElements'
import { H1Element, WrapperDiv } from '../GeneralElements'
import ShowErrors from '../ShowErrors';
import { sendDataToServer } from '../utils';

function RegisterUser({handleData}) {
    let [errors, setErrors] = useState([]);
    let [formData, setFormData] = useState({});

    let navigate = useNavigate()
    
    const enpoint = useContext(AppContexts)

    let handleChange = (evt, elm) => setFormData(prev => ({ ...prev, [elm]: evt.target.value }))

    let handleError = data => setErrors(data.errors)

    let updateData = result => {
        handleData(result)
        navigate(result.user?.topics.length < 4 ? "/choose-topics" : "/");
    }

    let handleSubmit = evt => {
        evt.preventDefault();
        sendDataToServer(enpoint.baseUrl+"/register", formData, handleError, updateData)
    }
    
    let renderFieldsets = () => createFormWithThese.map(data => <RenderFieldset key={data.id} data={data} handleChange={handleChange} />)
    
    return (
        <WrapperDiv className={"register-user"}>
            <H1Element value={"Register User"} />
            
            {errors?.length ? <ShowErrors errors={errors} /> : null}

            <FormElement handleSubmit={handleSubmit}>
                <LegendElement text={"Please enter all required fileds data(denoted by * next to them)"} />
                {renderFieldsets()}
                <SubmitButton text={"Register"} />
            </FormElement>
        </WrapperDiv>
    )
}

let RenderFieldset = ({ data, handleChange }) => {
    let { id, labelText, type, placeholder, required } = { ...data }

    return (
        <FieldsetElement>
            <LabelElement forVal={id} text={labelText} />
            <InputElement id={id} name={id} type={type} text={placeholder} required={required} handleChange={handleChange} />
        </FieldsetElement>
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