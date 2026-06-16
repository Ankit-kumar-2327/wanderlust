module.exports = function wrapAsync(fn) {
    return function(req, res, next){
        fn(req, res, next).catch(err => next(err));   // calling the next error handling middleware function with the error as argument
    }
}