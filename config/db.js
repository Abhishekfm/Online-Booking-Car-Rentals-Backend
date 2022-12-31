const mongoose = require("mongoose")
const MONGO_URL = process.env.MONGO_URL

const connectToDb = ()=>{
    mongoose.connect(MONGO_URL).then(
        (res)=>{
            console.log(`Connected DataBase: ${res.connection.host}`);
        }
    ).catch(
        (err)=>{
            console.log(err.message);
            process.exit(1)
        }
    )
}

module.exports = connectToDb