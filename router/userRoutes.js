const express = require("express")
const user_route = express();
const path = require('path');
const session = require("express-session");
const nocache = require("nocache");
const { v4: uuid4 } = require("uuid");
const bcrypt = require('bcrypt');
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req,file,cb) {
      return cb(null, "./asset/uploads");
  },
  filename : function (req,file,cb){
      return cb(null, `${Date.now()}-${file.originalname}`);
  }
})

// module.exports =  path.join(__dirname,'asset','uploads',new Date().getTime() + ".jpeg");

const upload = multer({storage})


const userController = require("../controllers/userController");

user_route.use(
  session({
    secret: uuid4(),
    resave: false,
    saveUninitialized: true,
  })
);

user_route.use(function (req, res, next) {
  if (!req.user)
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});


const Userauth = require("../middleware/userAuth");

user_route.set('view engine', 'ejs');
user_route.set('views', './views/user');

user_route.use(express.json());
user_route.use(express.urlencoded({ extended: true }));
user_route.use(nocache());


user_route.get('/',userController.loadBrowsepage);

user_route.get('/register', Userauth.isLogout, userController.loadRegister);

user_route.post('/register', userController.verifyRegister);

user_route.get('/otp', userController.loadOtp);

user_route.post('/otp', Userauth.isLogout, userController.verifyOtp);

user_route.get('/homepage', Userauth.isLogin, userController.loadHomepage);

user_route.get('/login', Userauth.isLogout, userController.loadLogin);

user_route.post('/login', userController.verifyLogin);

user_route.get('/products', Userauth.isLogin, userController.loadproducts);

user_route.get('/singleproduct', Userauth.isLogin, userController.loadSingleproduct);

user_route.get('/logout', Userauth.isLogin, userController.logout);

user_route.get('/userproducts/search', userController.userSearchproducts);

user_route.get('/searchbrowseproducts/search', userController.userbrowseSearchproducts);

user_route.post('/api/addtoBag', userController.addToBag);

user_route.post('/api/addtowish', userController.addToWish);

user_route.post('/api/updateQuantity', userController.updateQuantity);

user_route.get('/cart', Userauth.isLogin, userController.loadCart);

user_route.get('/wishlist', Userauth.isLogin, userController.loadWish);

user_route.get('/shipping', Userauth.isLogin, userController.loadshipping);

user_route.get('/deleteproduct', userController.deletecartproduct);

user_route.get('/deletewish', userController.deletewishproduct);

user_route.get('/movetocart', userController.movetoCart);

user_route.post('/shipping', Userauth.isLogin, userController.verifyshipping);

user_route.get('/editaddress', Userauth.isLogin, userController.loadeditAddress);

user_route.post('/editaddress', Userauth.isLogin, userController.verifyeditaddress);

user_route.get('/removeaddress', userController.removeAddress);

user_route.get('/payment', Userauth.isLogin, userController.loadpayment);

user_route.post('/payment', userController.verifypayment);

user_route.get('/ordersuccess', Userauth.isLogin, userController.loadordersuccess);

user_route.get('/order', Userauth.isLogin, userController.loadorders);

user_route.get('/cancelorder', userController.cancelorderproduct);

user_route.post('/filterbyprice', userController.showFilteredproducts);

user_route.get('/returnorder', userController.returnorderproduct);

user_route.post('/returnorder', Userauth.isLogin, userController.confirmreturnorder);

user_route.post('/savingdata', Userauth.isLogin,userController.saveOrderUpi);

user_route.post('/selectedaddress', Userauth.isLogin, userController.getselectedaddress);

user_route.get('/userprofile', Userauth.isLogin, userController.loadUserprofile);

user_route.post('/addprofileimage', Userauth.isLogin,upload.single('file'), userController.uploadProfileimage);

user_route.get('/singleorderdetails', Userauth.isLogin, userController.loadsingleorderdetails);

user_route.get('/invoice', Userauth.isLogin,userController.orderInvoice);

user_route.post('/applycoupon', Userauth.isLogin,userController.getCoupon);



module.exports = user_route;