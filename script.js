const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5001;

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://unnisk:Anjali*8075#@buyzoneclust.6iab9lo.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log("mongodb connected")
})
.catch(() => {
    console.log("connection failed");
});


const express = require("express");
const app = express();
const path = require('path');

app.use('/static', express.static(path.join(__dirname, 'asset')));


//for user routes
const userRoute = require("./router/userRoutes");
app.use("/", userRoute);

// for admin routes
const adminRoute = require("./router/adminRoutes");
app.use("/admin", adminRoute);


// listening to the port 

app.listen(PORT,()=>{
    console.log("listening to port 5001")
})

