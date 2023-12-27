const express = require('express');
const cors = require('cors');
const app = express();
require('./db/connectdb')
const ProductsRoute = require('./Routers/Products.route');
const UserRoute = require('./Routers/user.route');


// * Connecting To Port
const port = 3000;

// * Automatically parse incoming JSON to an object so we access it in our request handlers
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(cors({
  origin: "https://week-5-day-1-to-5-front-end-crud.vercel.app"
}));


// Set CORS headers manually
// Add middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST', 'OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    msg: "Product API Endpoint",
    create_product: "http://localhost:3000/api/add-product",
    get_Products: "http://localhost:3000/api/get-all-product",
    update_Products: "http://localhost:3000/api/update-product/:id",
    update_Products: "http://localhost:3000/api/delete-product/:id",
    msg_2: "User API Endpoint",
    register: "http://localhost:3000/api/auth/register",
    activateUser: "http://localhost:3000/api/auth/activate-user",
    login: "http://localhost:3000/api/auth/login",
    signIn: "http://localhost:3000/api/auth/sign-in"
  })
})
app.use("/api", ProductsRoute);
app.use("/api/auth", UserRoute);

// * listening To Port
app.listen(port, () => {
  console.log(`This is the ${port} active port! Wait for DB Connection...`);
});
