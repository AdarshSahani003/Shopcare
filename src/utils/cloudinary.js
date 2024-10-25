import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import fs from "fs"


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET
});
       
const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null

        const response = await cloudinary.uploader.upload
        (localFilePath,{
            resource_type: "auto"
        })
        console.log("file is uploaded successfully on Cloudinary");
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("Error occured while File Upload");
        return null
    }
}

export {uploadOnCloudinary}