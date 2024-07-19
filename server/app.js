const { upload } = require("./middlewares/uploadFile");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const userRouter = require("./routes/user.route");
const recipeRouter = require("./routes/recipe.route");
const categoryRouter = require("./routes/category.route");

const { pageNotFound, serverNotFound } = require("./middlewares/handleErrors");
const { auth } = require("./middlewares/auth");

require('dotenv').config();

require('./config/db')

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev")); 
// app.use(cors()); 
const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true
};

app.use(cors(corsOptions));



app.get("/", (req, res) => {
  res.send("wellcome");
  // res.sendFile("D:/server/uploads/1.jpg")
});
// app.post('/recipes',(req,res)=>{
//   console.log('req.body',req.body);
//   // res.sendFile("D:/server/uploads/1.jpg")
// })

// app.use('/images', express.static('uploads'));

app.use("/users", userRouter);
app.use("/recipes", recipeRouter);
app.use("/categories", categoryRouter);

app.use(pageNotFound);
app.use(serverNotFound);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});
