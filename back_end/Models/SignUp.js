const mongoose=require("mongoose")


const schema=mongoose.Schema(
    {
        "userType": {type: String,required:true},
        "name": {type: String,required:true},
        "email": {type: String,required:true},
        "password": {type: String,required:true},
    }
) 

let signupModel=mongoose.model("signup",schema)
module.exports={signupModel}