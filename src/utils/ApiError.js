class ApiError extends Error {
    constructor (
        statusCode,
        message = "Something Went Wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.errors = errors
        this.stack = stack
        this.data = null
        this.message = message
        this.success = false


        // Stack isliye lere hai ki proper StackTrace mil jaye ki yha yha error aarha hai
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)// documentation me aise hi likha jata hai
        }

    }
}

export {ApiError}