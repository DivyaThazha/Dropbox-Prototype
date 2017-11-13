const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001';

const headers = {
    'Accept': 'application/json'
};

export const doLogin = (payload) =>
    fetch(`${api}/users/doLogin`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });


export const doRegister = (payload) =>
    fetch(`${api}/users/doRegister`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const deleteFile = (payload1) =>
    fetch(`${api}/files/delete`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload1)
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });



export const deleteFolder = (payload1) =>
    fetch(`${api}/files/deleteFolder`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload1)
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });


export const getImages = () =>
    fetch(`${api}/files`)
        .then(res => res.json())
        .catch(error => {
            console.log("This is error.");
            return error;
        });

export const uploadFile = (payload) =>
    fetch(`${api}/files/upload`, {
        method: 'POST',
        body: payload
    }).then(res => {
        return res.status;
    }).catch(error => {
        console.log("This is error");
        return error;
    });

export const uploadFileGroup = (payload) =>
    fetch(`${api}/files/uploadFileGroup`, {
        method: 'POST',
        body: payload
    }).then(res => {
        return res.status;
    }).catch(error => {
        console.log("This is error");
        return error;
    });


/*export const uploadFile = (data) =>
    fetch(`${api}/files/upload`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });*/

export const uploadShareFile = (payload) =>
    fetch(`${api}/files/uploadShare`, {
        method: 'POST',
        body: payload
    }).then(res => {
        return res.status;
    }).catch(error => {
        console.log("This is error");
        return error;
    });

export const uploadShareFolder = (payload) =>
    fetch(`${api}/files/ShareFolder`, {
        method: 'POST',
        body: payload
    }).then(res => {
        return res.status;
    }).catch(error => {
        console.log("This is error");
        return error;
    });

export const doUserDetails = (payload) =>
    fetch(`${api}/users/doUserDetails`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const getUserDetails = () =>
    fetch(`${api}/users/getUserDetails`)
        .then(res => res.json())
        .catch(error => {
            console.log("This is error.");
            return error;
        });

export const getFiles = () =>
    fetch(`${api}/files/picture`)
        .then(res => res.json())
        .catch(error => {
            console.log("This is error.");
            return error;
        });



/*export function getFiles() {
    return dispatch =>
        axios
            .get('/files/picture')
            .then((response) => {
                dispatch({ type: FETCH_OFFERS, payload: response.data });
            })
            .catch((err) => {
                console.error(err);
            });
}*/


export const createFolder = (data) =>
    fetch(`${api}/files/createFolder`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const ViewFolder = (data) =>
    fetch(`${api}/files/ViewFolder`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        return res.json();
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });


export const ViewGroup = (data) =>
    fetch(`${api}/files/ViewGroup`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        return res.json();
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });


export const createGroup = (data) =>
    fetch(`${api}/files/createGroup`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

