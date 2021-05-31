class AuthenticationError extends Error{
    constructor(code,message){
        super(message);
        this.code = code;
        this.name = "AuthenticationError";
    }
}
class ServeError extends Error{
    constructor(code,message){
        super(message);
        this.code = code;
        this.name = "ServeError";
    }
}

module.exports={
    AuthenticationError,
    ServeError
};
