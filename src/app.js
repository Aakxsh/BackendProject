import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';





const app = express()

// cross origin resources -> ka matlab hai ki datakisis bhi browser se aaega to handle karna
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials : true
}))

//Isme ek limit lga di ki ki jo bhi data aaega to limit me hi aaye, isme json data handle karenge hum
app.use(express.json({limit: "20kb"}))
// age data url se aaega to use bhi handle karna 
app.use(express.urlencoded({extended : true, limit: "20kb"})) // extended ka matlab hai ki object k andar object use kar skte hai, but as sch koi requirement nahi hoti.

// static ka matlab hai ki kayi baar hum pdf files, word files store karna chahta hu server par image ho gyi to uske liye public assets bana dete hai.
app.use(express.static("public")) // koi jrurui nahi hai ki public hi name rakhe.

app.use(cookieParser())


//routes
import userRouter from "./routes/user.routes.js";





// routes declaration
app.use("/api/v1/users", userRouter)





export {app};