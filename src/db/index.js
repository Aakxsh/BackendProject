import mongoose from 'mongoose';
import {DB_NAME} from '../constants.js';


const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`); // host ka matlab hai ki hume pata hona chahiye ki hum kis server me connect hore h, q ki database production par alag hota hai, testing par alag hota hai or bhi etc.

    }catch(error){
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
}

export default connectDB;


























