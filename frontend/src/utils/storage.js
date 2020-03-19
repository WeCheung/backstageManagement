export function saveUser(userInfo) {
    localStorage.setItem('user', JSON.stringify({username: userInfo.username}))
}

export function getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}')
}

export function removeUser() {
    localStorage.removeItem('user')
}