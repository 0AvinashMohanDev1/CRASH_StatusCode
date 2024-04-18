const mongoose=require("mongoose");
require('dotenv').config();

const ConnectDB=mongoose.connect(process.env.mongoURL);

module.exports={
    ConnectDB
}