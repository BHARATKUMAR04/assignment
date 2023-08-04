const {USER} = require('../models');
const bcrypt = require('bcrypt');
const JWT  = require('jsonwebtoken');

exports.createUser = async(req,res)=>{
    const{name,email,password,role} = req.body;
    try {
        const hashpassword = await bcrypt.hash(password,10);
      const user = await USER.create({name,email,password:hashpassword,role});
      const token  = await JWT.sign({email:user.email,uuid:user.uuid},'test',{expiresIn:'2h'})
      res.status(200).json({user,token});
    } catch (error) {
      res.status(403).json(error.message);
    }
};
exports.getUsers = async(req,res)=>{
    try {
      const users = await USER.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(403).json(error.message);
    }
};
exports.getUserwithId = async(req,res)=>{
    try {
        const uuid = req.params.uuid;
        console.log("uuid:",uuid);

      const user = await USER.findOne({where:{uuid}});
      console.log("user:",user.dataValues);
      res.status(200).json(user);
    } catch (error) {
      res.status(403).json(error.message);
    }
};
exports.userUpadate = async(req,res)=>{
    const{name,email,password,role} = req.body;
    try {
        const uuid = req.params.uuid;
         const hashpassword = await bcrypt.hash(password,10);
      const user = await USER.findOne({where:{uuid}});
      user.name = name;
      user.email = email;
      user.password = hashpassword;
      user.role = role;
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(403).json(error.message);
    }
};
exports.deletUser  = async(req,res)=>{
const uuid  = req.params.uuid;
try {
    const user = await USER.findOne({where:{uuid}});
    await user.destroy();
    res.json({msg:"user deleted!!"});
} catch (error) {
    res.status(403).json(error.message);
}
};
exports.signin  = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await USER.findOne({where:{email}});
        if(!user){
            res.status(403).json({msg:"Email is not valid"});
        }
        const matchpass = await bcrypt.compare(password,user.password);
        if(!matchpass){
            res.status(403).json({msg:"Invalid Password"});
        } 
        const token = await JWT.sign({email:user.email,uuid:user.uuid},'test',{expiresIn:'2h'});
        res.status(200).json({user,token});
    } catch (error) {
        res.status(500).json({msg:error.message});
    }
}