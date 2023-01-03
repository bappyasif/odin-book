import moment from "moment";

const sendDataToServer = (endpoint, dataObj, errorHandler, handleData) => {
    // console.log(userStillLoggedIn(), "send DATa")
    fetch(endpoint, {
        method: "post",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObj)
    }).then((resp) => {
        if (resp.status >= 200 && resp.status <= 299) {
            // just making all previously existing error to be removed with an empty array
            errorHandler([]);
            let data = resp.json();
            data
                .then(respData => {
                    // alert("login successfull")
                    handleData(respData)
                })
                .catch(err => console.error('error occured', err))
        } else {
            let data = resp.json();
            data
                .then(respData => {
                    errorHandler(respData);
                })
                .catch(err => console.error('error occured', err))
        }
    }).catch(err => console.error('post request is failed', err))
}

const updateUserInDatabase = (endpoint, dataObj, dataUpdater, navigate, navigateTo) => {
    // console.log(userStillLoggedIn(), "update User")
    fetch(endpoint, {
        method: "put",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObj)
    }).then(resp => {
        let data = null
        if (resp.status >= 200 && resp.status <= 299) {
            data = resp.json();
            data.then(() => {
                // alert("user data is updated, will be redirected to home page")
                let key = Object.keys(dataObj)[0]
                let value = Object.values(dataObj)[0]
                dataUpdater(key, value)
                navigateTo ? navigate(`/${navigateTo}`) : navigate("/")
            }).catch(err=>console.log(err))
        }
    }).catch(err=>console.log(err));
}

// const acceptOrRejectUserFriendRequest = () => {

// }

const updateDataInDatabase = (endpoint, dataObj, dataUpdater) => {
    // console.log(userStillLoggedIn(), "update Data")
    // console.log(dataObj, "dataObj")
    fetch(endpoint, {
        method: "put",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObj)
    }).then(resp => resp.json())
    .catch(err => console.error(err, "request responded with error"))
    .then(data => {
        console.log(data);
        dataUpdater && dataUpdater(data)
    })
    .catch(err => console.error(err, "something's wrong!!"))
}

const readDataFromServer = (endpoint, dataUpdater) => {
    // console.log(userStillLoggedIn(), "read data")
    fetch(endpoint)
        .then(resp => resp.json())
        .catch(err => {
            dataUpdater({ errors: [err], data: [] })
        })
        .then(data => {
            dataUpdater({ data: data, errors: [] })
        })
        .catch(err => dataUpdater({ errors: [err], data: [] }))
}

const getAuthenticatedUserDataFromServer = (endpoint, dataUpdater) => {
    fetch(
        endpoint,
        {
            method: "GET",
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Credentials": true
            }
        }
    ).then(resp => {
        if (resp.status === 200) {
            return resp.json()
        }
    }).catch(err => console.error(err, "response err!!"))
        .then(data => {
            console.log(data, "!data!")
            dataUpdater({ data: data, errors: [] })
        })
        .catch(err => dataUpdater({ errors: [err], data: [] }))
}

const logoutUserFromApp = (url, clearOutUserData) => {
    fetch(url)
        .then(res => res.json())
        .catch(err => console.log("response error!!", err))
        .then(data => {
            console.log("logged out!!", data.success)
            // localStorage.removeItem("uid")
            removeJwtDataFromLocalStorage()
            clearOutUserData && clearOutUserData()
        })
        .catch(err => console.error(err))
}

const deleteResourceFromServer = (endpoint, dataObj, dataUpdater) => {
    // console.log(userStillLoggedIn(), "delete data")
    // console.log(endpoint, "!!endpoint")
    fetch(endpoint, {
        method: "delete",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataObj)
    }).then(resp => {
        if(resp.status === 200) {
            return resp.json()
        }
    })
    .catch(err => console.log(err, "response error!!"))
    .then(result => {
        console.log("data deleted", result);
        dataUpdater && dataUpdater(result)
    })
    .catch(err => console.error(err))
}

const getUserDataAfterJwtVerification = (url, accessToken, dataUpdater) => {
    fetch(url,
        {
            method: "GET",
            credentials: 'include',
            headers: {
                "Authorization": `${accessToken}`,
                "Accept": 'application/json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Credentials": true
            }
        }
    ).then(resp => {
        if(resp.status >= 200) {
            return resp.json()
        }
    })
    .catch(err => console.log(err, "response error!!"))
    .then(result => {
        // console.log("data deleted", result);
        dataUpdater && dataUpdater(result)
    })
    .catch(err => console.error(err))
}

// const storeJwtAuthDataInLocalstorage = (token, expiresIn) => {
//     // const expires = moment().add(expiresIn, "days").toISOString()
//     // const expires = moment(expiresIn).toISOString()
//     // const expires = moment().add(expiresIn.split(" ")[0]).toISOString()
//     // console.log(expiresIn, expires, moment.duration().add(expiresIn.split(" ")[0], "s"))

//     console.log(expiresIn)

//     const expires = moment().add(expiresIn);
//     console.log(expires, JSON.stringify(expires.valueOf()))
//     localStorage.setItem("expires", JSON.stringify(expires.valueOf()));
//     localStorage.setItem("token", token);
// }

const storeJwtAuthDataInLocalstorage = (token, expiresIn) => {
    // setting 5 min token validation window
    const expires = Date.now() + (20 * 1000);
    localStorage.setItem("expires", expires);
    localStorage.setItem("token", token);
}

export const getExpiration = () => {
    const expiration = localStorage.getItem("expires");
    const expiresAt = JSON.parse(expiration);
    // return moment(expiresAt)
    return expiresAt
}

const userStillLoggedIn = () => {
    const expiresIn = localStorage.getItem("expires");
    // const loginStatus = moment().isBefore(expiresIn);
    const loginStatus = moment().isBefore(getExpiration());
    
    return loginStatus
}

const removeJwtDataFromLocalStorage = () => {
    localStorage.removeItem("expires")
    localStorage.removeItem("token")
}

export {
    sendDataToServer,
    readDataFromServer,
    getAuthenticatedUserDataFromServer,
    getUserDataAfterJwtVerification,
    updateUserInDatabase,
    updateDataInDatabase,
    logoutUserFromApp,
    deleteResourceFromServer,
    storeJwtAuthDataInLocalstorage,
    removeJwtDataFromLocalStorage,
    userStillLoggedIn
}