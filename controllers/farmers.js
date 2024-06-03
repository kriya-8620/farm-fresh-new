
const Farmer=require("../models/farmer");
const Crop=require("../models/crop");
const ExpressError=require("../utils/ExpressError.js");
module.exports.index=async(req,res)=>{
    try {
        const farmers = await Farmer.find(); // Fetch farmers from your database
        res.render("farmers/index.ejs",{farmers});
        
    } catch (err) {
        let errMsg=err.details.map((el)=>el.message).join(",");
            throw new ExpressError(500,errMsg);
    }

    
};

module.exports.resources=(req, res) => {
    res.render('farmers/farmer_resources.ejs');
};

module.exports.showname=async(req,res)=>{
    const farmers=await Farmer.find();
   
    res.render("farmers/farmer.ejs",{farmers});
    };

module.exports.showdetails=async(req,res)=>{
    
    const farmers=await Farmer.findById(req.params.id);
    if(!farmers)
    {
        req.flash("error","Farmer you are looking for does not exist");
        res.redirect("/farmers");
    }
    res.render("farmers/show.ejs",{farmers});
    };

module.exports.registration=async(req,res)=>{
        
       
    res.render("farmers/new.ejs");
    };

module.exports.submitRegistration=async(req,res)=>{
    const existingUser=await Farmer.findOne({owner:req.user._id});
    if(existingUser)
        {
          req.flash("error"," User already registered");
          return res.redirect("/farmers");
        }
   
    const newFarmer=await new Farmer(req.body.farmer);
    newFarmer.owner=req.user._id;
    newFarmer.save();
    
    req.flash("success","Farmer Registration Successfull");
    res.redirect("/farmers");
    
    

    };

module.exports.editInformation=async(req,res)=>{
    const id=req.params.id;
   const farmer=await Farmer.findById(id);
   if(!farmer)
   {
       req.flash("error","Farmer you are looking for does not exist");
       res.redirect("/farmers");
   }
   res.render("farmers/edit.ejs",{farmer});
   };

module.exports.updateInformation=async(req,res)=>{
    const id=req.params.id;
    
    await Farmer.findByIdAndUpdate(id, {...req.body.farmer});
    req.flash("success","Updated Successfully");
        res.redirect("/farmers");
      
    
    }

module.exports.sellingCrops=async(req,res)=>{
        
};

module.exports.soldCrops=async(req,res)=>{
    try{
    
        const registeredUser=await Farmer.findOne({owner:req.user._id});
        if(registeredUser)
            {
                const soldCrops=await Crop.find({farmer:registeredUser._id});
                if(soldCrops.length===0)
                    {
                        req.flash("error","You have not sold any crops yet");
                        return res.redirect("/farmers");
                    }
    
                else{
                    res.render("crops/soldcrops.ejs",{crops:soldCrops});
                }
            }
        else{
    
            req.flash("error","You have not registered yet");
            res.redirect("/farmers/new");
        }
    
    }catch(err)
    {
    throw new ExpressError(500,err);
    }
    
    
    
      };

module.exports.destroyInformation=async(req,res)=>{
    await Farmer.findByIdAndDelete(req.params.id);
    req.flash("success","Deleted Successfully");
    res.redirect("/farmers");
    };
module.exports.submitSellingCrops=async(req,res)=>{
    const farmer=await Farmer.findOne({owner:req.user._id});
    
    const newCrop=await new Crop(req.body.crop);
    newCrop.farmer=farmer;
    newCrop.save();
    req.flash("success","Successfully sell crops");
    res.redirect("/farmers");
    

};

module.exports.farmersMarket=(req, res) => {
    res.render('farmers/farmer_market.ejs');
};

module.exports.about=(req, res) => {
    res.render('farmers/about.ejs');
};


