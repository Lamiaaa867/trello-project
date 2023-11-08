import { taskModel } from "../../../DB/models/task.model.js";
import { userModel } from "../../../DB/models/user.model.js";
//==========================add task=====================

export const addTask=async(req,res,next)=>{
   const {id}=req.auth
    const {userid}=req.query
    const {title,description,status,deadline,assignTo}=req.body;
    const task=await taskModel.findOne({title});
    if (task){
        return res.status(401).json({message:"task already exist "})
    }
   if (userid!==id.toString()){
        return res.status(401).json({message:"please enter valid id"}) 
    }
   const userexist=await userModel.findById(assignTo)
   if(!userexist){
    return res.status(401).json({message:"user isn,t exist"})
   }
    const taskInstance=new taskModel({title,description,status,deadline,assignTo})
    taskInstance.save()
    console.log(taskInstance)
   // console.log(new Date())
    return res.status(200).json({message:"task added",taskInstance})

   // return res.status(200).json({message:"task added"})
    //console.log(taskInstance)

}
//=========================update task==================
export const updateTask=async(req,res,next)=>{
    const {id}=req.auth;
    const {userid}=req.query;
    const {_id}=req.query
    const {title,description,status,deadline}=req.body;
    const task=await taskModel.findById(_id);
    if (!task){
        return res.status(401).json({message:"invalid task"})
    }
    if (userid!==id.toString()){
        return res.status(401).json({message:"please enter valid id"}) 
    }
    const newTask=await taskModel.findByIdAndUpdate({_id},
        {title,description,status,deadline},
        {new:true})
        return res.status(200).json({message:"task updated",newTask}) 

}
//===========================delete task===================
export const deleteTask=async(req,res,next)=>{
    const {id}=req.auth;
    const {userid}=req.query;
    const {_id}=req.query
   // const {title,description,status,deadline}=req.body;
    const task=await taskModel.findById(_id);
    if (!task){
        return res.status(401).json({message:"invalid task"})
    }
    if (userid!==id.toString()){
        return res.status(401).json({message:"please enter valid id"}) 
    }
    const deletedTask=await taskModel.findByIdAndDelete({_id},
        {new:true})
        return res.status(200).json({message:"task deleted",deletedTask}) 

}
//===================get all tasks with user data==========
export const getTaskWithUser=async(req,res,next)=>
{
const allTasks=await taskModel.find().populate([
    {
        path:'assignTo',
        select:'username-_id'
    }
])  
return res.status(200).json({message:"done",allTasks})
}
//==================tasks don,t ended 
export const deadlineTask=async(req,res,next)=>{
const tasks =await taskModel.find({deadline:{$lt:new Date()},status:{$ne:'Done'}})
if(!tasks){
    return res.status(400).json({message:"no tasks"})
}
return res.status(200).json({message:"done",tasks})
}
