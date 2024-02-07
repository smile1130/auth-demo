var express = require('express');
var perf = require('execution-time-async')();
var router = express.Router();
perf.config();

/* GET home page . */
router.get('/',ensureAuthenticated, function(req, res, next) {
  const userRole = req.user.role;
  if (userRole === 'crud') {
    res.redirect('/crud');
  } else if (userRole === 'user') {
    res.redirect('/users'); 
  }
});
function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login')
}
module.exports = router;
