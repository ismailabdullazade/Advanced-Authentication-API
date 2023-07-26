const mongoose = require("mongoose")

mongoose.connect(process.env.DB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log("Welcome to db");
})
.catch((err)=>{
    console.log("Error occured: ",err);
})