import mongoose, {Schema} from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';  // direct encrypt karna possible nahi hai to hum use karte hai mongoose k kuch hooks ki, like pre-hooks which means jese data save hone se phle middle ware lgade ki password encypt krde save hone se phle databse me 

const userSchema = new Schema (
    {
        username:{
            type:String,
            required :true,
            unique:true,
            lowercase:true,
            trim: true,
            index : true // kisi bhi field ko agar searchable banana hai to uska index true krdo.
        },

        email:{
            type:String,
            required :true,
            unique:true,
            lowercase:true,
            trim: true,
            
        },

        fullName:{
            type:String,
            required :true,
            trim: true,
            index : true
        },

        avatar:{
            type:String,  // cloudinary url use karenge isme 
            required :true,
        },

        coverImage:{
            type:String,
        },

        watchHistory:[{
            type: Schema.Types.ObjectId,
            ref: "Video",
        }],

        password:{
            type:String,
            required:[true, "Password is requires"] // isme humne define kar dia ki jo password required rhega || custom message pass kra hai.
        },

        refreshToken:{
            type: String
        }
    },
    {
        timestamps: true
    })


// bcrypt:
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);   // is code matlab hai ki jb bhi data update krenge to har baar password encrypt kr dega ye chij to galat hai isliye humne ise if statement me daala hai ki jab bhi password related work ho tabhi encrypt kare.
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}// middleware ke flag ka naam h ki next ka acess hona hi chahiye, next ka matlab h ki ye flag ab aage pass kardo



// JWt:
// JWT is bearer token hai which means ye token jiske bhi pass hai me usko data bejhdunga, like jiske pass bhi key hai me lock khol dunga.
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({                          // jwt k pass sign method hota hai
        _id : this._id,
        email : this.email,
        username: this.username,
        fullName : this.fullName,
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }


    )
}


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({                          // jwt k pass sign method hota hai
        _id : this._id,
    },

    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}



export const User = mongoose.model('User', userSchema)

