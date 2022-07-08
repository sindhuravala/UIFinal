// 1. import any needed libraries
const express = require("express");
const jwt = require('jsonwebtoken');
const User = require('../models/user'); //accesses functions in user model file
const verifyUser = require("../verifyUser");
const router = express.Router();

// 2. create all routes to access database
router
  .post('/login', async (req, res) => {
    try {
      const user = await User.login(req.body.email, req.body.password);
      const admin_id = user.admin_id;
      const username = user.username;
      const email = user.email;
      const userData = {admin_id, username, email};
      const accessToken = jwt.sign(userData, process.env.ACCESS_SECRET,{
          expiresIn: '10m'
      });
      const refreshToken = jwt.sign(userData, process.env.REFRESH_SECRET,{
          expiresIn: '1d'
      });
      const token = await User.updateToken(email, refreshToken);
      ////console.log("User",tokenUpdate);
      //console.log("Original token ",refreshToken);
      //console.log("Test",token);
      res.cookie('refreshToken', refreshToken,{
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      }).send({ accessToken, refreshToken });
    } catch(error) {
      res.status(401).send({ message: error.message });
    }
  })

  .post('/register', async (req, res) => {
    try {
      const user = await User.register(req.body.name, req.body.email, req.body.password);
      res.send({message: 'User saved successfully'});
    } catch(error) {
      res.status(401).send({ message: error.message }); 
    }
  })

  .get('/token', async (req, res) => {
    try {
      //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MCwidXNlcm5hbWUiOiJ3aWxzb24iLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjU2ODcwMDMxLCJleHAiOjE2NTY5NTY0MzF9.JeJzlVNLHK8iTNMmoqNJhUfMV43UCSl50Gfy0P-ekuE
      //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MCwidXNlcm5hbWUiOiJ3aWxzb24iLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjU2ODcwMDMxLCJleHAiOjE2NTY5NTY0MzF9.JeJzlVNLHK8iTNMmoqNJhUfMV43UCSl50Gfy0P-ekuE
      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken) return res.sendStatus(401);
      const user = await User.getToken(refreshToken);
      if(!user) return res.sendStatus(403);
      //console.log('tocken',user);
      jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403);
        //console.log('user tok',decoded);
        const admin_id = user.admin_id;
        const username = user.username;
        const email = user.email;
        const userData = {admin_id, username, email};
        const accessToken = jwt.sign(userData, process.env.ACCESS_SECRET);
        res.json({ accessToken });
      });  
    } catch(error) {
      //console.log('Error', error);
      res.sendStatus(403);
    }
  })

  .put('/updatepassword',verifyUser, async (req, res) => {
    try {
      const user = await User.updatePassword(req.body.admin_id, req.body.password);
      res.send({ success: "Password changed successfully" });
    } catch(error) {
      res.status(401).send({ message: error.message });
    }
  })

  .delete('/delete',verifyUser, async (req, res) => {
    try {
      await User.deleteUser(req.body.admin_id);
      res.clearCookie('refreshToken');
      res.send({ success: "Account deleted" });
    } catch(error) {
      res.status(401).send({ message: error.message });
    }
  })

  .get('/logout', async(req, res) =>{
    try {
      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken) return res.sendStatus(204);
      const user = await User.getToken(refreshToken);
      if(!user) return res.sendStatus(204);
      const token = await User.updateToken(user.email, null);
      //console.log(token);
      res.clearCookie('refreshToken');
      return res.sendStatus(200); 

    } catch(error) {
      res.sendStatus(204);
    }

})

// 3. export router for use in index.js
module.exports = router;