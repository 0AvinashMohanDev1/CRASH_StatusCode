const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:String,
    password:String,
    email:String,
    role:{
        type:String,
        default:'User',
        enum:['Manager','Staf','Admin','User']
    },
    createdAt: { type: Date, default: Date.now }
})

const UserModel=mongoose.model("Crash_assignment_2",userSchema);

module.exports={
    UserModel
}