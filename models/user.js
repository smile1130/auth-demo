var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');
mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(()=> console.log('DB Connected'))
    .catch((err)=>console.log(err))
var userSchema=mongoose.Schema({
    name:{
        type:String,
        index:true
    },
    password:{
        type:String
    },
    email:{
        type:String
    },
    profileimage:{
        type:String
    },
    uname:{
        type:String
    },
    contact:{
        type:Number
    },
    role:{
        type:String
    }
});
var User=module.exports=mongoose.model('user',userSchema);

module.exports.getUserById = async function (id) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
};

module.exports.getUserByUsername = function (username) {
    var query = { uname: username };
    return User.findOne(query);
};  

module.exports.getAllUsers = function () {
    var query = { role: 'user' };
    return User.find(query);
};

module.exports.comparePassword = async function (candidatePassword, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(candidatePassword, hashedPassword);
      return isMatch;
    } catch (error) {
      throw error;
    }
};

module.exports.createUser=function(newUser,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
            newUser.password= hash
            try{
                newUser.save();
                console.log(newUser);
            }
            catch(e){
                console.log(e);
            }

        });
    });
}

module.exports.updateUserById = async function (id, updatedUser) {
    try {
      const user = await User.findByIdAndUpdate(id, updatedUser);
      return user;
    } catch (error) {
      throw error;
    }
};
module.exports.deleteUserById = async function (id) {
    try {
      const user = await User.findByIdAndDelete(id);
      return user;
    } catch (error) {
      throw error;
    }
};