const express = require('express');
const router = express.Router();

require("../db/database");

const User = require("../model/UserSchema");
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
    res.send("hello from server router");
});

router.post('/register',async (req, res) => {
    const {name, email, password,  phone}  = req.body;
    
    if(!name || !email || !password || !phone){
        return res.status(422).json({error : 'Please enter all the details'});
    }

    try{
        const userExists = await User.findOne({email : email});
        if(userExists){
            return res.status(422).json({error : "User already exists"});
        }

        const user = new User({name: name, email, password, phone});

        await user.save();
        res.status(201).json({message : "user registration successfully"});
    }
    catch(error){
        console.log(error);
    }
});

router.post('/signin', async (req, res) => {
    const {email , password} = req.body;

    if(!email || !password) { 
        return res.status(400).json({error : "Please enter all the details"});
    }

    try{
        const userLogin = await User.findOne({email : email});
        
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);

            if(!isMatch){
                res.status(400).json({error: "Invalid Credentials Password"});
            }
            res.status(200).json({message : "Successfully logged in "});
        }
        
        res.status(402).json({error: "Invalid Credentials Email"}); 
    }   
    catch(error) {
        console.log(error);
    }
});

module.exports = router;