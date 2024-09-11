import {v2 as cloudinary} from 'cloudinary';
import dotenv from "dotenv";
dotenv.config({
    path:'./.env'
})
import { log } from 'console';
import fs from "fs";  // fs is known as file system and by default nodejs k sth aata hai, ye fs node ke andr milta hai.


// comes from cloudinary
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

console.log("the configurations is: " , process.env.CLOUDINARY_CLOUD_NAME)

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        console.log("local file path from cloudinary: " ,localFilePath)
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type :"auto"
        })
     console.log("response from cloudinary: " , response);
    //file has been uploaded successfully
    console.log("File has been succcesfully upload in cloudinary", response.url); // public url return kara dia
    return response

    }catch(error){
        fs.unlinkSync(localFilePath) // Remove the local saved temporary file as the upload got failed
        return null;
    }
}



export {uploadOnCloudinary}