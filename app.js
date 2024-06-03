
if(process.env.NODE_ENV!=="production")
    {
        require('dotenv').config();
    };

    console.log(process.env.NODE_ENV);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
//let url="mongodb://127.0.0.1:27017/farmer";
const User=require("./models/user");
const path=require("path");
const ejs=require("ejs");
const ejsMate= require('ejs-mate')
const methodOverride=require("method-override");
const ExpressError=require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const farmerRouter=require("./routes/farmer.js");
const userRouter=require("./routes/user.js");
const cartRouter = require('./routes/cart'); 
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require("passport-local");
const bodyParser = require('body-parser');

const dbUrl=process.env.ATLASDB_URL;

// Connect with database
main()
.then(()=>{
    console.log("Successfully connected with database");
})

.catch((err)=>{
    console.log(err);
})

async function main()
{
    
await mongoose.connect(dbUrl);
}

app.use(bodyParser.json());
// set for the view directory
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// set engine for ejsTemplate
app.engine('ejs', ejsMate);

// Parse data into Json data

app.use(express.urlencoded({extended:true}));


// Method Override
app.use(methodOverride("_method"));

// serve the public folder

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());

// Configure session store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // Time period in seconds
  });

  store.on("error",()=>{
    console.log("error in Mongo session store",err);
  });

const sessionOptions={
    store,
    secret:process.env.SECRET,  
    resave: false,         
    saveUninitialized: true ,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};
    
// Session configuration
app.use(session(sessionOptions));
app.use(flash());

// Initialize Passport
app.use(passport.initialize());

// Use sessions with Passport
app.use(passport.session());

//Passport local strategy
passport.use(new LocalStrategy(User.authenticate()));


// Serialize and Deserialize user using User.serializeUser() and User.deserializeUser()
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUser=req.user;
// Check if req.session.cart exists and set res.locals.cartItemCount accordingly
if (req.session.cart && req.session.cart.length) {
    res.locals.cartItemCount = req.session.cart.length;
} else {
    // If cart is empty or not defined, set cartItemCount to 0
    res.locals.cartItemCount = 0;
}

next();
});


// send to farmer page using routes
app.use("/farmers",farmerRouter);

// send to user sign up login logout page using routes
app.use("/",userRouter);
// Use cart routes
app.use('/', cartRouter); 

 


// home page
/*app.get("/home",(req,res)=>{
res.send("I am home page");
});
*/


// when no route is matched with defined route
app.all("*",(req,res)=>{
throw new ExpressError(400,"Page not found");
});




// Error Handling
app.use((err,req,res,next)=>{
    let{status=500,message="Something went wrong"}=err;
    res.status(status).render("error.ejs",{message});
});

// server started
app.listen(8080,()=>{
    console.log("server is running");
});

