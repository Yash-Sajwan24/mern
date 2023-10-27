const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const cookieParser = require("cookie-parser");
router.use(cookieParser());

require("../db/database");

const User = require("../model/UserSchema");
const bcrypt = require('bcryptjs');

const authenticate = require('../middleware/authenticate');


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
    let token;

    if(!email || !password) { 
        return res.status(402).json({error : "Please enter all the details"});
    }

    try{
        const userLogin = await User.findOne({email : email});
        
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);

            token = await userLogin.generateAuthToken();

            //jwtoken is the name 
            res.cookie('jwtoken', token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
            });

            if(!isMatch){
                res.status(402).json({error: "Invalid Credentials"});
            }
            else{
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

router.get('/about',authenticate,  (req, res)=>{
    res.send(req.rootUser);
});

module.exports = router;