const express = require("express");
const Post = require('../models/post'); //accesses functions in user model file
const router = express.Router();

// 2. create all routes to access database
router
  .post('/UserPosts', async (req, res) => {
    try {
      const posts = await Post.getUserPosts(req.body.admin_id);
      res.send(posts);
    } catch(error) {
      res.status(401).send({ message: error.message });
    }
  })
  .post('/SeePost', async (req, res) => {
    try {
      const post = await Post.SeePost(req.body.postid);
      res.send({...post});
    } catch(error) {
      res.status(401).send({ message: error.message });
    }
  })

  .post('/CreatePost', async (req, res) => {
    try {
      const post = await Post.CreatePost(req.body.postcontent, req.body.admin_id);
      res.send({message: "Post Saved"});
    } catch(error) {
      res.status(401).send({ message: error.message }); 
    }
  })

  .put('/UpdatePost', async (req, res) => {
    try {
      const post = await Post.updatePost(req.body.postId, req.body.postcontent);
      res.send({message: "Post Updated"});
    } catch(error) {
      res.status(401).send({ message: error.message });
    }
  })

  .delete('/DeletePost', async (req, res) => {
    try {
      await Post.deletePost(req.body.postid);
      res.send({ success: "Post deleted" });
    } catch(error) {
      res.status(401).send({ message: error.message });
    }
  })

// 3. export router for use in index.js
module.exports = router;