require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser=require('body-parser');
const verifyUser = require('./server/verifyUser');
const userRoutes = require('./server/routes/user');
const postRoutes = require('./server/routes/post');

mongoose.connect(process.env.dbURL)
  .then(console.log("DB Connected!!"))
  .catch(error => console.log(error));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 
app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(express.static(__dirname + "/public"));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public', 'index.html')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-Width,Content-Type,Accept,Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
  next();
});

app.use('/user', userRoutes);
app.use('/post',verifyUser, postRoutes);
const PORT = process.env.PORT || 3000;
console.log(PORT);
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));