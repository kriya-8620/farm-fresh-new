
const Farmer=require("../models/farmer.js");
const initdata=require("./data.js");
const mongoose=require("mongoose");
let url="mongodb://127.0.0.1:27017/farmer";


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
await mongoose.connect(url);
}

// data initialized in the database
const initDB=async()=>{
await Farmer.insertMany(initdata.data);
console.log("data successfully initialized in the Database");
};

initDB();