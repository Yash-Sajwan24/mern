const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

require('./db/database');

app.use(express.json());

app.use(require('./util/auth'));
// const user = require('./model/UserSchema');

const port = process.env.PORT;

const middleware = (req, res, next) => {
    console.log("this is the middleware");
    next();
};

app.get('/',middleware , (req, res) =>{
    res.send("this is the home page");
});

app.get('/about', (req, res)=>{
    res.send("this is the about section");
});

app.get('/contact', (req, res)=>{
    // res.cookie("Test", "Yash is pro gamer");
    res.send("this is the contact section");
});

app.listen(port, () => {
    console.log(`the server is running on port ${port}`);
});