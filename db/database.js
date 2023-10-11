const mongoose = require('mongoose');

const DB = process.env.MONGODB;

mongoose.connect(DB).then(() => {
    console.log("mongodb connected successfully");
}).catch((err) => {
    console.log("some error occurred");
});
