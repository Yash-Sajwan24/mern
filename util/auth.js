const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const cookieParser = require("cookie-parser");
router.use(cookieParser());

require("../db/database");

const User = require("../model/UserSchema");
const bcrypt = require('bcryptjs');

const authenticate = require('../middleware/authenticate');


router.get('https://mernbackend-0so8.onrender.com/home',authenticate,  (req, res) => {
    res.send(req.rootUser);
});

router.post('https://mernbackend-0so8.onrender.com/register',async (req, res) => {
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

router.post('https://mernbackend-0so8.onrender.com/signin', async (req, res) => {
    const {email , password} = req.body;
    let token;

    if(!email || !password) { 
        return res.status(402).json({error : "Please enter all the details"});
    }

    try{
        const userLogin = await User.findOne({email : email});
        
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);
            if(!isMatch){
                res.status(402).json({error: "Invalid Credentials"});
            }
            else{
                token = await userLogin.generateAuthToken();

                //jwtoken is the name 
                res.cookie('jwtoken', token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                });
    
               
                res.status(200).json({message : "Successfully logged in "});
            }
        }
        else{
            res.status(402).json({error: "Invalid Credentials"}); 
        }
    }   
    catch(error) {
        console.log(error);
    }
});

router.get('https://mernbackend-0so8.onrender.com/about',authenticate,  (req, res)=>{
    res.send(req.rootUser);
});

router.get('https://mernbackend-0so8.onrender.com/getdata',authenticate,  (req, res)=>{
    res.send(req.rootUser);
});

router.get('https://mernbackend-0so8.onrender.com/logout',  (req, res)=>{
    res.clearCookie('jwtoken', {path : '/'});// if there is no cookie it goes to the home page
    res.status(200).send("User logout");
});

router.post('https://mernbackend-0so8.onrender.com/contact',authenticate, async (req, res)=>{
    
    const {name, email, phone, message} = req.body;

    if(!name || !email || !phone || !message){
        return res.status(402).json({error: "Enter data in all the fields."});
    }

    try{
        const sendMessage =await User.findOne({_id : req.userID});
        if(sendMessage){
            const messageReceived = await sendMessage.addMessage(name, email, phone, message);
            await sendMessage.save();

            res.status(200).json({message : "Successfully added"});
        }
        else{
            res.status(402).json({error: "Login first"});
        }
    }
    catch(err){
        res.status(402).json({error: "Some Error Occurred."});
    }


});

module.exports = router;