const express = require('express');
const router = express.Router();

require("../db/database");
const User = require("../model/UserSchema");

router.get('/', (req, res) => {
    res.send("hello from server router");
});

router.post('/register', (req, res) => {
    const {name, email, phone}  = req.body;
    
    if(!name || !email || !phone){
        return res.status(422).json({error : 'Please enter all the details'});
    }

    User.findOne({email : email})
    .then((userExists) => {
        if(userExists){
            return res.status(422).json({error : "User already exists"});
        }

        const user = new User({name: name, email, phone});

        user.save().then(() => {
            res.status(201).json({message : "user registration successfully"});
        })
        .catch((error) => {
            console.log(error);
        })
    })
    

});



module.exports = router;