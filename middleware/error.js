//code for error handling

const { NextFunction, Request, Response } = require("express");
const ErrorHandler = require("../utils/ErrorHandler");

const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    if (err.name === 'Casterror') { // Wrong MongoDB error
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    if (err.code == 11000) { // Duplicate Key error
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name == 'JsonWebTokenError') { // Wrong JWT error
        const message = `JSON Web Token is Invalid, Try again`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name == 'TokenExpiredError') { //Token Expire Error
        const message = `JSON Web Token Expired, Try Again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

module.exports = ErrorMiddleware;
