const checkIfAdmin = (email)=>{
    if(email === "abhishek@admin.com"){
        return true
    }
    return false
}

module.exports = checkIfAdmin