const checkIfAdmin = (email)=>{
    if(email === process.env.ADMIN_MAIL){
        return true
    }
    return false
}

module.exports = checkIfAdmin