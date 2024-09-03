import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req, res) => {
    //  res.status(200).json({
    //     message:"ok"
    // })



    // user registration :-
    //get user details from frontend
    // validation - not empty
    // check if user already exist- username, email
    // check for image, check for avatar
    //upload them to cloudinary, avatar
    // create user object - creation entry in db
    // remove password and refresh token field from response
    //check for user creation
    // return resposne

     const {fullName, email, username, password}= req.body
     console.log(email, password)


    // agr ek check karna ho to bs if case ya fir beginner can use more if else condition
    //  if(fullName === ""){
    //     throw new ApiError(400, "fullname is required")
    //  }


     if (
        [
            fullName, email, username, password
        ].some((field) => field?.trim === "")
    ) {
        throw new ApiError (400, "All fields are required")
     }



     const existedUser = User.findOne({
        $or: [{ username },{ email }]
     })
    

     if(existedUser){
        throw new ApiError(409, " User with email or username already exists")
     }

    // multer gives you the files ka access
    const avatarLocalPath =  req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.file?.coverImage[0]?.path;


    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }


    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const cloudImage = await uploadOnCloudinary(coverImageLocalPath)



    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }



    const user = await User.create({
        fullName,
        avatar: avatar.url, // validation confirm of avatar is available or not 
        coverImage:coverImage?.url || "" ,
        // but not coverImage that's why we need take care of 
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken") //select method - consist iske andr jo chij nahi chahiye hoti hai vo likhte hai string ke andr the sign of "-" means doestnot consist like password, refresh token


    if (!createdUser){
        throw new ApiError (500, "something went wrong while registring the user")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )



})



export {registerUser}

