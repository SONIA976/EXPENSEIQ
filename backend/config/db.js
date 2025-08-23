const mongoose=require("mongoose");

const connectDB=async()=>{
   try{
     await mongoose.connect(process.env.MONGO_URI,{});
     console.log("MongoDB connected");
   }catch(err){
    console.error("error connecting to MongoDB",err);
    // Don't exit immediately, let the server continue
    // process.exit(1);
    
    // Retry connection after 5 seconds
    console.log("Retrying connection in 5 seconds...");
    setTimeout(() => {
      connectDB();
    }, 5000);
   }
   };

module.exports=connectDB;    
