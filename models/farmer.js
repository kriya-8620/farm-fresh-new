const mongoose=require("mongoose");


const farmerSchema=mongoose.Schema({
farmer_name:{
              type:String,
              maxlength:30,
              required:true,

},
aadhar_no:{
            type:Number,
            maxlength:12,
            required:true,
},
mobile_no:{
            type:Number,
            maxlength:10,
            required:true,
},
gender:{
         type:String,
         required:true,
},
district:{
          type:String,
          required:true,
},
block:{
        type:String,
        required:true,
},
pincode:{
          type:Number,
          required:true,
},
owner:{
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User', 
         
         
},

});




const Farmer=mongoose.model("Farmer",farmerSchema);

module.exports=Farmer;