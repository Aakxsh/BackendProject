const  asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
    

} // HigherOrder function aur ye vala same work hai bs ye variety hai likhne ka.







export {asyncHandler}




// // HigherOrder function -> Jo function ko as a parameter bhi accept karte hai ya fir variable return kar skte hai.
// const asyncHandler = (fn) => async (err, req, res, next) => {
//     try{
//         await (err, req, res, next)

//     }catch (error){
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }

// export {asyncHandler}