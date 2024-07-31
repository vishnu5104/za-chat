const express = require("express");
const logger = require("../logger");
const bcrypt = require('bcrypt');

// ---------- User Register Controller ----------- //
export const userRegister = ((req, res) => {
    try {
        const payload = req.body;

        // hashing password before registering user
        bcrypt.hash(payload.password, +10, async (err, hashPass) => {
            if(err){
                res.send({message: err.message});
            }else{
                payload.password = hashPass;
                // const User = new UserModel(payload);
                // await User.save();
                res.send({ "message": `User Registeres Successfully !`});
            }
        })
        res.send('hello from user register route')
    } catch (error) {
        logger.error('Error while registering the user');
        console.log(error);
    }
});

// ---------- User LogIn Controller ----------- //
export const userLogin = () => {
    try {

    } catch (error) {
        logger.error('Error whilw registering the user');
        console.log(error);
    }
};

// ---------- Reset Password Controller ----------- //
export const resetPassword = () => {
    try {

    } catch (error) {
        logger.error('Error whilw registering the user');
        console.log(error);
    }
};

// ---------- User Details Fetch Controller ----------- //
export const fetchUserProfile = () => {
    try {

    } catch (error) {
        logger.error('Error whilw registering the user');
        console.log(error);
    }
};