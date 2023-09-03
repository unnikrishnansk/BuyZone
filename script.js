const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5001;

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://unnisk:eDZcx1HtU7DCyKTu@buyzoneclust.6iab9lo.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log("mongodb connected")
})
.catch((err) => {
    console.log("connection failed",err);
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

// app.get('/*', function (req, res) {
//     res.render('404error');
//   })


// listening to the port 

app.listen(PORT,()=>{
    console.log("listening to port 5001")
})

