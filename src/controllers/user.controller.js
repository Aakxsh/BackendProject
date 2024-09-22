import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";




const generateAccessAndRefreshtokens = async (userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false})

        return {accessToken, refreshToken}




    }catch(error){
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}

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


    //get user details from frontend
    const {fullName, email, username, password}= req.body
    console.log(email, password)


    // agr ek check karna ho to bs if case ya fir beginner can use more if else condition
    //  if(fullName === ""){
    //     throw new ApiError(400, "fullname is required")
    //  }



    // validation - not empty
     if (
        [
            fullName, email, username, password
        ].some((field) => field?.trim() === "")
    ) {
        throw new ApiError (400, "All fields are required")
     }

    

    // check if user already exist- username, email
    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
     })
    
     if(existedUser){
        throw new ApiError(409, " User with email or username already exists")
     }


    
    // check for image, check for avatar
    // multer gives you the files ka access
    const avatarLocalPath =  req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;


    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }



    //upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)



    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }



    // create user object - creation entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url, // validation confirm of avatar is available or not 
        coverImage:coverImage?.url || "" ,
        // but not coverImage that's why we need take care of 
        email,
        password,
        username: username.toLowerCase()
    })




    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken") //select method - consist iske andr jo chij nahi chahiye hoti hai vo likhte hai string ke andr the sign of "-" means doestnot consist like password, refresh token



    //check for user creation
    if (!createdUser){
        throw new ApiError (500, "something went wrong while registring the user")
    }



    // return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )



})

// loginUser
const loginUser = asyncHandler(async (req, res)=>{
    // req -> body
    // username or email
    // find the user
    // password check
    // access and refersh token
    // send cookie

    const {email, username, password} = req.body

    if(!username && !email){
        throw new ApiError(400, "useraname or password is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(404, "password incorrect")
    }

    // access and refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshtokens(user._id)



    //cookie
    const loggedInUser = await User.findById(user._id)
    select('-password -refreshToken')


    const options ={
        httpOnly : true, // jese hi httpOnly true krte hai ise koi access ni kar skta from frontend se
        secure:true // ye cookie sirf server se modifiable hai 
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,{
                user: loggedInUser, accessToken,
                refreshToken
            },
            "User loggedIn successfully"
        )
    )
})




// logout user
const logoutUser = asyncHandler(async(req, res) =>{
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options ={
        httpOnly : true, // jese hi httpOnly true krte hai ise koi access ni kar skta from frontend se
        secure:true // ye cookie sirf server se modifiable hai 
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logut successfully"))//{}- data are not passing in curly braces
})


// refreshAccessToken Endpoint
const refreshAccessToken = asyncHandler(async(req, res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }



try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
    
        if(!user){
            throw new ApiError(401, "Invalid refresh Token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh Token is expired or used")
        }
    
        const options = {
            httpOnly:true,
            secure: true
        }
    
        const {accessToken, newrefreshToken} = await generateAccessAndRefreshtokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(200, {accessToken, newrefreshToken},
                "Access Token refreshed Token"
            )
        )
} catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh Token")
}

})









export {registerUser, loginUser, logoutUser, refreshAccessToken}

