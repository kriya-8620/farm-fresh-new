const mongoose=require("mongoose");
const cropSchema=mongoose.Schema({
    crops:{
                  type:String,
                  
                  required:true,
    
    },
    district:{
                type:String,
                
                required:true,
    },
    location:{
                type:String,
                
                required:true,
    },
    date:{
             type:Date,
             required:true,
    },
    quantity:{
              type:Number,
              required:true,
    },
    price:{
            type:Number,
            required:true,
    },
    total:{
              type:Number,
              required:true,
    },

    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer'
    },
    });

    
const Crop=mongoose.model("Crop",cropSchema);

module.exports=Crop;