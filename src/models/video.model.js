import mongoose, {Schema} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';


const videoSchema = new Schema(
    {
        videoFiles:{
            type: String,   // cloudinary
            required: true,
        },

        thumbnail:{
            type:String,
            required:true
        },
        
        title:{
            type:String,
            required:true
        },

        description:{
            type:String,
            required:true
        },

        duration:{
            type:Number,  // cloudinary
            required:true
        },

        views:{
            type:Number,
            default:0
        },

        isPublished:{  // video public k liye available hai ya nahi hai
            type:Boolean,
            default:true
        },

        ownerOfVideo:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }


    },

    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const video = mongoose.model("Video", videoSchema)


// bcrypt is usualy to Hash your Password
// JSON Web Tokens (JWTs) are a standardized way to securely send data between two parties. 



// There are two ways to upload file
// 1 -> Express file uplaod.
// 2 -> Multer file upload.
// Multer file upload k liye use hota hai.

