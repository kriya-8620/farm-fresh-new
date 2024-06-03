const express=require("express");
const router=express.Router();
const {farmerSchema,cropSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,isRegistered}=require("../middleware.js");
const farmersController=require("../controllers/farmers.js");


// Farmer Schema Validation
const validateFarmer=(req,res,next)=>{
    
    const {error}=farmerSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(500,errMsg);
    }
    else{
        next();
    }
    }
    
    // Crop Schema Validation
    
    const validateCrop=(req,res,next)=>{
        const {error}=cropSchema.validate(req.body);
        if(error)
        {
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(500,errMsg);
        }
        else{
            next();
        }
        }
    

// to show the Home page
router.get("/",wrapAsync(farmersController.index));


    // Route for Farmer Resources
router.get('/resources', wrapAsync(farmersController.resources));
   
     
    // to show the farmer name
    router.get("/details",wrapAsync(farmersController.showname));
      
    // to show farmers details
    router.get("/details/:id",wrapAsync(farmersController.showdetails));
    
    
       
    // farmer registration form
    router.get("/new",isLoggedIn,wrapAsync(farmersController.registration));
    
     
    
    // submit farmer registration form
    router.post("/",isLoggedIn,validateFarmer,wrapAsync(farmersController.submitRegistration));
    
     // Edit Farmer Details
     router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(farmersController.editInformation));
    
    // Uptade farmer details
    router.put("/:id",isLoggedIn,isOwner,validateFarmer,wrapAsync(farmersController.updateInformation));
    
    // delete farmer details
    router.delete("/:id",isLoggedIn,isOwner,wrapAsync(farmersController.destroyInformation));
    
    
    // Sell the Crops
    router.get("/crops",isRegistered,wrapAsync(farmersController.sellingCrops));
    
  // crops sold by farmers
  router.get("/soldcrops",isLoggedIn,wrapAsync(farmersController.soldCrops));

    // Submit Crops into database
    router.post("/crops",validateCrop,wrapAsync(farmersController.submitSellingCrops));

// Route for Farmer Market
router.get('/market',wrapAsync(farmersController.farmersMarket));

// Route for Farmer Market
router.get('/about', wrapAsync(farmersController.about));

    
    module.exports=router;