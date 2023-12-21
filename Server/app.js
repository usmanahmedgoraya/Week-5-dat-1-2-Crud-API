const express = require('express');
const cors = require('cors');
const app = express();
require('./db/connectdb')
const ProductsRoute = require('./Routers/Products.route')

// * Connecting To Port
const port = 3000;


// * Automatically parse incoming JSON to an object so we access it in our request handlers
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(cors({
  origin:"http://localhost:5173"
}));


// Set CORS headers manually
// Add middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET','POST','OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
  
app.get("/",(req,res)=>{
  res.status(200).json({
    create_product : "https://week-5-dat-1-2-crud-api.vercel.app/api/create-product",
    Get_all_product:"https://week-5-dat-1-2-crud-api.vercel.app/api/get-all-product",
    update_product:"https://week-5-dat-1-2-crud-api.vercel.app/update_product/:id",
    delete_Product:"https://week-5-dat-1-2-crud-api.vercel.app/api/delete-product/:id"
  })
})
app.use("/api",ProductsRoute);

// * listening To Port
app.listen(port, () => {
    console.log(`This is the ${port} active port! Wait for DB Connection...`);
});
