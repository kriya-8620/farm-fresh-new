const Farmer=require("./models/farmer");
module.exports.isLoggedIn=(req,res,next)=>{
    req.session.redirectUrl=req.originalUrl;
      if(! req.isAuthenticated())
      {
      req.flash("error","You must be logged in");
      return res.redirect("/login");
      }
      next();
  }
  
  
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl)
  {
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
  
  }

  module.exports.isOwner=async(req,res,next)=>{
    const id=req.params.id;
    const farmer=await Farmer.findById(id);
    if(!farmer.owner.equals(res.locals.currUser._id))
      {
        req.flash("You dont have permission to edit");
        return res.redirect(`/farmers/${id}`);
      }
  next();

  }

  module.exports.isRegistered=async(req,res,next)=>{
    if(req.user)
      {
          const existingUser=await Farmer.findOne({owner:res.locals.currUser._id});
          if(existingUser)
              {
                  return res.render("crops/crop.ejs");
              }

              else{
                  req.flash("error","You need to register before sell your crops");
                 return res.redirect("/farmers/new");
              }
      }
      else{
          req.flash("error","You need to login before sell your crops");
        return  res.redirect("/login");

      }
     
    }
