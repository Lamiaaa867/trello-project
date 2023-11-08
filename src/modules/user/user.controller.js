import { userModel } from "../../../DB/models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {sendEmail } from "../../services/emailService.js";
//=========================sign up===================
export const signUp=async(req,res,next)=>{
    const {username,email,password,cpassword,gender,age,phone,tasks}=req.body;
    const userExist=await userModel.findOne({email})
    if(userExist){
        return res.status(400).json({message:"email is already exist"})
    }
    if (password!==cpassword){
        return res.status(400).json({message:"please enter correct password"})
    }
    const token=jwt.sign({email},'email');
    const confirmedMail=`http://localhost:4000/user/confirm/${token}`
    const message=`<a href=${confirmedMail}>confirm your email please</a>`
const sendMail= await sendEmail({
    message,
    to:email,
    subject:"confirmation mail",
   

})
if(!sendMail){
    return res.status(500).json({message:"invalid email"})
}
    const hashedPassword=bcrypt.hashSync(password,+process.env.salt_level)
    const userInstance= new userModel({username,email,password:hashedPassword,gender,age,phone,tasks})
    await userInstance.save()
    return res.status(200).json({message:"user added successfully",userInstance})
}
//=======================confirm email API===================
export const ConfirmEmail=async(req,res,next)=>{
    const {token}=req.params;
    const verify=jwt.verify(token,'email')
    const finduser=await userModel.findOne({email:verify.email})
    if (finduser.isConfirmed){
      return res.status(400).json({message:"is confirmed already",finduser})
    }
const updateUser=await userModel.findOneAndUpdate({email:verify.email},
    {isConfirmed:true},
    {new:true}
    )
    return res.status(200).json({message:"confirmed done",updateUser})
}
//========================log in =============================
export const logIn=async(req,res,next)=>{
    const {email,password}=req.body;
    const userExist=await userModel.findOne({email,isConfirmed:true})
    if(!userExist){
        return res.status(400).json({message:"sign up or confirm your email please"})
    }

    const passMatch=bcrypt.compareSync(password,userExist.password)
    if (!passMatch){
        return res.status(401).json({message:"wrong password please enter correct password"})
    }
userExist.is_online=true;
const userToken=jwt.sign({email,
    id:userExist._id,
     deleted:userExist.is_deleted,
     loggedin:userExist.is_online,
    username:userExist.username,
age:userExist.age}
     ,'user')

     if (userExist.is_deleted===true){
        return res.status(401).json({message:"user is deleted please sign up"})
     }
    
        return res.status(200).json({message:"log in successfully",userToken , userExist})   
}
//====================change password==================================
export const changePass=async(req,res,next)=>{
    const {id}=req.auth
    const {_id}=req.query;
    const {oldpass,cpass,password}=req.body;
    const userExist=await userModel.findOne({_id,isConfirmed:true});
    if (!userExist){
        return res.status(400).json({message:"in valid user id"})
    }
    if (userExist._id.toString()!==id){
        return res.status(400).json({message:"un outhorized"})
    }
    const passMatch=bcrypt.compareSync(oldpass,userExist.password)
    if (!passMatch){
        return res.status(401).json({message:"old pass wrong"})
    }
    if (password!==cpass){
        return res.status(400).json({message:"please enter match pasword"})
    }
    const bcryptpass=bcrypt.hashSync(password,+process.env.salt_level)
   
    const newPaa=await userModel.findByIdAndUpdate({_id}
        ,{password:bcryptpass},
        {new:true})
      return res.status(200).json({ message: 'Done', newPaa })
}
//====================update=============================================
export const updateData=async(req,res,next)=>{
    const {id}=req.auth;
    const {username,age }=req.body;
    const{_id}=req.query;
    const userExist=await userModel.findOne({_id,isConfirmed:true});
    if (!userExist){
        return res.status(400).json({message:"in valid user id"})
    }
    if (userExist._id.toString()!==id){
        return res.status(400).json({message:"un outhorized"})
    }
    const updatedUser=await userModel.findByIdAndUpdate({_id},
        {username,age},
        {new:true })
      return res.status(200).json({ message: 'Done', updatedUser })

}
//=======================delete data===========================
export const deleteData=async(req,res,next)=>{
    const {id}=req.auth;
   // const {username,age }=req.body;
    const{_id}=req.query;
    const userExist=await userModel.findOne({_id,isConfirmed:true});
    if (!userExist){
        return res.status(400).json({message:"in valid user id"})
    }
    if (userExist._id.toString()!==id){
        return res.status(400).json({message:"un outhorized"})
    }
    const deletedUser=await userModel.findOneAndDelete({_id} )
        res.status(200).json({ message: 'Done', deletedUser })

}
//===============================soft delete===================
export const softDelete=async(req,res,next)=>{
    const {id}=req.auth;
    const{_id}=req.query;
    const userExist=await userModel.findOne({_id,isConfirmed:true});
    if (!userExist){
        return res.status(400).json({message:"in valid user id"})
    }
    if (userExist._id.toString()!==id){
        return res.status(400).json({message:"un outhorized"})
    }   
    const updatedUser = await userModel.findByIdAndUpdate({_id}, { is_deleted: true },
       {new:true} );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User soft deleted successfully' ,updatedUser});
}
//================================log out===========================
export const logOut=async(req,res,next)=>{
    const {id}=req.auth;
    const{_id}=req.query;
    const userExist=await userModel.findOne({_id,isConfirmed:true});
    if (!userExist){
        return res.status(400).json({message:"in valid user id"})
    }
    if (userExist._id.toString()!==id){
        return res.status(400).json({message:"un outhorized"})
    }   
    const updatedUser = await userModel.findByIdAndUpdate({_id}, { is_online: false },
       {new:true} );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User logged out' ,updatedUser});
}
//===================all tasks for one user========================
export const tasksforoneuder=async(req,res,next)=>{
    const {id}=req.auth;  
     const{userid}=req.query;
     const userExist=await userModel.findOne({userid,isConfirmed:true});
     if (!userExist){
         return res.status(400).json({message:"in valid user id"})
     }
     if (userExist._id.toString()!==id){
         return res.status(400).json({message:"un outhorized"})
     }
     const info =await userModel.findById(userid).populate([
        {
            path:'tasks',
            select:'title-_id'
        }
     ])
     return res.status(200).json({message:"done",info})
}
