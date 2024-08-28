import multer from "multer";



// ye code cloudinary se aya hai
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, file.originalname)  // originalfilename se file ka original name aajaega yha ka './public/temp'
    console.log(file.originalname)
    }
  })
  
export  const upload = multer({ storage: storage })