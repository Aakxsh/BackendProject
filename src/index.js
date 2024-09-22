import dotenv from "dotenv";
dotenv.config({
    path:'./.env'
})
import connectionDB from "./db/index.js";
import app from "./app.js";

// console.log("the cloudinary configurations is from index file: " , process.env.CLOUDINARY_CLOUD_NAME);
console.log("the db config from folder is: " , process.env.MONGODB_URI);

//this statement will print all the available env variables

// console.log('Process Env:', process.env);
connectionDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at PORT: ${process.env.PORT}`);
    }) 
})
.catch((error) => {
    console.log("MongoDB connection failed", error)
})







// import express from 'express';
// const app = express()

// const connectDB = async () => {
//     try {
//         const connectionInstance = await mongoose.connnect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         console.log(`\n MONGODB connected !! DB HOST: ${connectionInstance.connection.host}`);
//         app.on("error", (error) => {
//             console.log("Error: ", error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on PORT ${process.env.PORT}`);
//         })
//     }
//     catch (error) {
//         console.log("MONGOOSE Connection error", error);
//         process.exit(1)
//     }
// }

// export default connectDB












