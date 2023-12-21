const mongoose = require('mongoose')

// * This is the mongodb Atlas connection link
const dbConnect = 'mongodb+srv://gorayausman061:Z0GiGTFr4JIPiUvl@cluster0.vdk3ku9.mongodb.net/Ecommerce?retryWrites=true&w=majority';


// * This is the mongodb Atlas connection
mongoose.connect(dbConnect).then(() => {

    console.log('Hurrah! MongoDB connection successfully established :)');

}).catch((err) => {

    console.log('Sorry Bro! MongoDB is not connected :(', err);

})