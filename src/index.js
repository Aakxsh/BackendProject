import dotenv from "dotenv";
import connectionDB from "./db/index.js";
import app from "./app.js";


dotenv.config({
    path:'./env'
})


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












