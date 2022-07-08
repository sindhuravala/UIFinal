// 1. import mongoose
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

// 2. create schema for entity
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true},
  email: { type: String, required: true},
  password: { type: String, required: true},
  token: String,
  followers: [String],
  following: [String]
})
userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'admin_id' });
// 3. create model of schema
const User = mongoose.model("User", userSchema);
// 4. create CRUD functions on model
//CREATE a user
async function register(username, email, password) {
  const user = await getUser(email);
  if(user) throw Error('Email already in use');
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username: username,
    email: email,
    password: hashed,
    token: null
  });

  return newUser._doc;
}

// READ a user
async function login(email, password) {
  const user = await getUser(email);
  if(!user) throw Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch) throw Error('Wrong Password');

  return user._doc;
}

// UPDATE
async function updatePassword(id, password) {
  const user = await User.updateOne({"admin_id": id}, {$set: { password: password}});
  return user;
}
//UPDATE TOKEN
async function updateToken(email, token) {
  const user = await User.findOneAndUpdate({"email": email}, {$set: { token: token}});
  return user;
}

//DELETE
async function deleteUser(id) {
  await User.deleteOne({"admin_id": id});
};

// utility functions
async function getUser(email) {
  return await User.findOne({ "email": email});
}

async function getToken(token) {
  return await User.findOne({ token: token});
}

// 5. export all functions we want to access in route files
module.exports = { 
  register, login, updatePassword,updateToken, deleteUser , getToken
};