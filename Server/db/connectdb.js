const mongoose = require('mongoose')
require('dotenv').config()

// * This is the mongodb Atlas connection link
const dbConnect = process.env.MONGO_URI;


// * This is the mongodb Atlas connection
mongoose.connect(dbConnect).then(() => {

    console.log('Yeah! my boy, You nailed it. MongoDB is connected successfully :)');

}).catch((err) => {

    console.log('Sorry Bro! MongoDB is not connected :(', err);

})