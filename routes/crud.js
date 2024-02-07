var express = require('express');
var perf = require('execution-time-async')();
var router = express.Router();
var User = require('../models/user')
perf.config();

router.get('/',ensureAuthenticated,async function(req, res, next) {
    const allUsers = await User.getAllUsers();
    res.render('crudDashboard', {users: allUsers});
});

router.post('/update/:id', ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUser = req.body;

      await User.findByIdAndUpdate(userId, updatedUser);

      res.status(200).send('Success');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

router.delete('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.params.id;

      await User.findByIdAndDelete(userId);

      res.status(200).send('Success');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login')
}
module.exports = router;