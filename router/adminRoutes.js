const express = require("express")
const admin_route = express();
const session = require("express-session");
const nocache = require("nocache")
const { v4: uuid4 } = require("uuid");
const path = require('path')

const multer  = require('multer');
const sharp = require('sharp');

// const upload = multer({ dest: 'uploads/' })

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        return cb(null, "./asset/uploads");
    },
    filename : function (req,file,cb){
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
    
})

const fileFilter = function (req, file, cb) {
    const allowedFileTypes = ['.jpeg', '.jpg', '.png', '.svg'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(extname)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and SVG files are allowed.'), false); // Reject the file
    }
};

// module.exports =  path.join(__dirname,'asset','uploads',new Date().getTime() + ".jpeg");

const upload = multer({storage,fileFilter})




const adminController = require("../controllers/adminController");

admin_route.use(session({ 
    secret: uuid4(),
    resave:false,
    saveUninitialized:true,    
}));

admin_route.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
  });

  
const Adminauth = require("../middleware/adminAuth");



admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');

// const bodyParser = require("body-parser");
admin_route.use(express.json());
admin_route.use(express.urlencoded({ extended: true }));
admin_route.use(nocache());


admin_route.get('/adminlogin', Adminauth.isLogout, adminController.loadLogin); 

admin_route.post('/adminlogin', adminController.verifyLogin);

admin_route.get('/adminhomepage',Adminauth.isLogin, adminController.loadHomepage);

admin_route.get('/usermanagement',Adminauth.isLogin, adminController.loadUsermanagementpage);

admin_route.get('/search', adminController.searchUser);

admin_route.get('/block',Adminauth.isLogin, adminController.userBlockstatus);

admin_route.get('/categorymanagement',Adminauth.isLogin, adminController.loadCategorypage);

admin_route.get('/category/search', adminController.searchCategory);

admin_route.get('/addcategory',Adminauth.isLogin, adminController.loadAddcategory);

admin_route.post('/addcategory',Adminauth.isLogin, upload.single('file'), adminController.verifyaddCategory);

admin_route.get('/editcategory',Adminauth.isLogin, adminController.loadCategoryedit);

admin_route.get('/deletecategory',Adminauth.isLogin, adminController.deleteCategory);

admin_route.post('/editcategory',Adminauth.isLogin, upload.single('file'), adminController.verifyeditCategory);

admin_route.get('/productmanagement',Adminauth.isLogin, adminController.loadProductpage);

admin_route.get('/addproduct',Adminauth.isLogin, adminController.loadAddproduct);

admin_route.post('/addproduct', upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'image', maxCount: 5 }
  ]), adminController.verifyAddproduct )

admin_route.get('/product/search', adminController.searchProduct);

admin_route.get('/editproduct',Adminauth.isLogin, adminController.loadeditProduct);

admin_route.post('/editproduct',Adminauth.isLogin,  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'image', maxCount: 5 }
  ]) , adminController.verifyEditproduct)

admin_route.get('/deleteproduct', adminController.deleteProduct);

admin_route.get('/adminlogout',Adminauth.isLogin, adminController.adminlogout);

admin_route.get('/deleteimage', adminController.deleteImage);

admin_route.get('/ordermanagement',Adminauth.isLogin, adminController.loadOrderpage);

admin_route.get('/orderadmindetails',Adminauth.isLogin, adminController.loadAdminorder);

admin_route.post('/changedate',Adminauth.isLogin, adminController.verifycahngedate);

admin_route.post('/changeorderstatus',Adminauth.isLogin, adminController.verifychangestatus);

admin_route.get('/couponmanagement',Adminauth.isLogin, adminController.loadCouponmanagementpage);

admin_route.get('/addcoupon',Adminauth.isLogin, adminController.loadaddCoupon);

admin_route.post('/addcoupon',Adminauth.isLogin, adminController.verifyaddCoupon);

admin_route.get('/discardcoupon',Adminauth.isLogin, adminController.discardCoupon);

admin_route.get('/editcoupon',Adminauth.isLogin, adminController.editCoupon);

admin_route.post('/editcoupon',Adminauth.isLogin, adminController.VerifyeditCoupon);

admin_route.get('/listedcoupons',Adminauth.isLogin, adminController.Loadlisted);

admin_route.get('/listcoupon',Adminauth.isLogin, adminController.changetolisted);

admin_route.get('/unlistedcoupons',Adminauth.isLogin, adminController.Loadunlisted);

admin_route.get('/bannermanagement',Adminauth.isLogin, adminController.LoadBanner);

admin_route.get('/addbanner',Adminauth.isLogin, adminController.LoadaddBanner);

admin_route.post('/addbanner',Adminauth.isLogin,upload.single('file'), adminController.VerifyaddBanner);

admin_route.get('/editbanner',Adminauth.isLogin, adminController.LoadeditBanner);

admin_route.post('/editbanner',Adminauth.isLogin,upload.single('file'), adminController.VerifyeditBanner);

admin_route.get('/banner/search', adminController.searchBanner);

admin_route.get('/deletebanner', adminController.deleteBanner);

admin_route.post('/report',Adminauth.isLogin, adminController.LoadReport);

admin_route.post('/downloadreport',Adminauth.isLogin, adminController.LoaddownloadReport);

admin_route.get('*', function (req, res) {
    res.redirect('/admin');
})


module.exports = admin_route;