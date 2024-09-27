import  {Router} from "express";
import {upload} from "../middleware/multer.middleware.js" 
import { loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUsercoverImage, 
    getUserChannelProfile, 
    getWatchHistory } from "../controllers/user.controller.js";
    
import { verifyJWT } from "../middleware/auth.middleware.js";




const router = Router()



router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount : 1,
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),

registerUser)


router.route("/login").post(loginUser)


// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
export default router 

router.route("/refresh-token").post
(refreshAccessToken)

router.route("/changed_Password").post(verifyJWT, changeCurrentPassword)

router.route("/current_User").get(verifyJWT, getCurrentUser)

router.route("/update_Account_Details").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT,upload.single("avatar"), updateUserAvatar)

router.route("/coverImage").patch(verifyJWT, upload.single("coverImage"), updateUsercoverImage)

// when we use params
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/watch_History").get(verifyJWT, getWatchHistory)






export {registerUser}