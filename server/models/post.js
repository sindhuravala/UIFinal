// 1. import mongoose
const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

// 2. create schema for entity
const postSchema = new mongoose.Schema({
  post_content: { type: String, required: true},
  post_delete: {type: String},
  admin_id:{ type: Number, required: true} 
})

// 3. create model of schema
postSchema.plugin(autoIncrement.plugin, { model: 'Post', field: 'post_id' });
const Post = mongoose.model("Post", postSchema);

// 4. create CRUD functions on model
//CREATE a post
async function CreatePost(postcontent, adminid) {
    const newPost = await Post.create({
    post_content: postcontent,
    admin_id: adminid
  });
  return newPost;
}

//GET POST
async function getUserPosts(admin_id) {
  return await Post.find({"admin_id":admin_id});
}

// READ a user
async function SeePost(postid) {
  return await Post.findOne({"post_id":postid});
}

// UPDATE
async function updatePost(id, postcontent) {
  const post = await Post.updateOne({"_id": id}, {$set: { post_content: postcontent}});
  return post;
}

//DELETE
async function deletePost(id) {
  await Post.deleteOne({"_id": id});
};

// utility functions
async function getPost(adminid) {
  return await Post.findOne({ "admin_id":adminid});
}

// 5. export all functions we want to access in route files
module.exports = { 
  CreatePost,  updatePost, deletePost, getPost, SeePost, getUserPosts
};