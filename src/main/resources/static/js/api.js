
api = {
    baseUrl: "http://localhost:8080",
    userInfo: (username) =>
        fetch(`${api.baseUrl}/api/account/${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.ok)
                return res.json()
            else return res.json()
                .then(r => {
                    throw r
                })
        }).catch(error => {
            controller.error(error)
            throw error
        }),
    createUser: (userInfo) =>
        fetch(`${api.baseUrl}/api/account`, {
            method: "POST",
            body: JSON.stringify(userInfo),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.ok)
                return res.json()
            else return res.json()
                .then(r => {
                    throw r
                })
        }).catch(error => {
            controller.error(error)
            throw error
        }),
    fetchUserChats: () =>
        fetch(`${api.baseUrl}/api/conversations`, {
            headers: {
                "Authorization": auth.authentication(),
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.ok)
                return res.json()
            else return res.json()
                .then(r => {
                    throw r
                })
        }).catch(error => {
            controller.error(error)
            throw error
        }),
    joinGroup: (group) =>
        fetch(`${api.baseUrl}/api/conversations/users`, {
            method: "POST",
            body: JSON.stringify({groupName: group}),
            headers: {
                "Authorization": auth.authentication(),
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.ok)
                return res.json()
            else return res.json()
                .then(r => {
                    throw r
                })
        }).catch(error => {
            controller.error(error)
            throw error
        })
}
