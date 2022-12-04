import React from 'react'
import { useNavigate } from 'react-router';
let UsingHocForUserLoggedInCheck = SomeComp => {
    let NewComponent = props => {
        return <SomeComp {...props} />
    }

    return NewComponent;
}

let CheckIsUserLogged = (props) => {
    let navigate = useNavigate()

    console.log(props.loggedIn ? "redirect to success" : "redirect to failure")
    return props.loggedIn ? <PrivatePage /> : navigate("/login")
}

let PrivatePage = () => <h2>Private Page</h2>

// let CheckIsUserLogged = (props) => {
//     console.log(props.loggedIn)
//     console.log(props.loggedIn ? "redirect to success" : "redirect to failure")
//     return <div>user loggedIn: {props.loggedIn ? "redirect to success" : "redirect to failure"}</div>
// }

export default UsingHocForUserLoggedInCheck(CheckIsUserLogged)