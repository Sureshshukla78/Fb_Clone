const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog")
.then(()=>{
    console.log("Connection is stablished with MongoDb.");
}).catch((e)=>{
    console.log(`Error in connecting due to :${e}`)
});