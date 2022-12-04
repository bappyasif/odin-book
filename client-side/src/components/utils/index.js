const sendDataToServer = (endpoint, dataObj, errorHandler, handleData) => {
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
                    alert("login successfull")
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
                alert("user data is updated, will be redirected to home page")
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

export {
    sendDataToServer,
    readDataFromServer,
    getAuthenticatedUserDataFromServer,
    updateUserInDatabase,
    updateDataInDatabase
}