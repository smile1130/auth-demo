var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');
var User=require('../models/user');

mongoose.connect('mongodb://127.0.0.1/test')
    .then(()=> console.log('DB Connected'))
    .catch((err)=>console.log(err))

const seedAdmin = function(){
    bcrypt.genSalt(10,function(err,salt){
        const newUser = new User({
            name:"Admin",
            password: "crud",
            email: "admin@crud.com",
            profileimage:"noimage.jpg",
            uname: "Admin",
            contact: "1234567890",
            role:"crud"
        });
        bcrypt.hash(newUser.password,salt,function(err,hash){
            newUser.password= hash
            try{
                newUser.save();
            }
            catch(e){
                console.error(e);
            }
        });
    });
}

seedAdmin();