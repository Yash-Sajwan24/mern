const express = require('express');
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');

app.use(cors({credentials: true}));

dotenv.config();

require('./db/database');

app.use(express.json());

app.use(require('./util/auth'));
// const user = require('./model/UserSchema');

const port =  process.env.PORT || 4000;

// const middleware = (req, res, next) => {
//     console.log("this is the middleware");
//     next();
// };

// app.get('/about',middleware,  (req, res)=>{
//     res.send("this is the about section");
// });

app.listen(port, () => {
    console.log(`the server is running on port ${port}`);
});
