const Connexion = require("../models/connexion");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


exports.login = async(req, res)=>{
   try{
const user = await Connexion.findOne({email: req.body.email})
if(!user){
   return  res.status(400).json({message: "donnés incorrect"})
}
const comparaison = await bcrypt.compare(req.body.code, user.code)
if(!comparaison){
    return res.status(400).json({message: "donnés incorrect !"})
}
res.status(200).json({
    userId : user._id,
    profilCree : user.profilCree,
    token: jwt.sign(
    {userId: user._id},
    process.env.JWT_SECRET)
})
   }
catch(error){
    res.status(500).json({error})
}
    
}
