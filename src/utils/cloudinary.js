import {v2 as cloudinary} from 'cloudinary';
import { log } from 'console';
import fs from "fs";  // fs is known as file system and by default nodejs k sth aata hai.



cloudinary.config({ 
  cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME', 
  api_key: 'API_KEY', 
  api_secret: 'CLOUDINARY_API_SECRET' 
});



const uplaodOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        //uplado the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type :"auto"
        })
     
    //file has been uploaded successfully
    console.log("File has been succcesfully upload in cloudinary", response.url); // public url return kara dia
    return response

    }catch(error){
        fs.unlinkSync(localFilePath) // Remove the local saved temporary file as the upload got failed
        return null;
    }
}



export {cloudinary}