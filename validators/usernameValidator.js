let usernameRegex =/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;

function isUsernameValid(username) {
    if(!usernameRegex.test(username)) {
        return false
    }
    return true
}   

module.exports = {
    isUsernameValid
}

