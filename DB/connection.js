import mongoose from "mongoose";
import { taskModel } from "./models/task.model.js";
export const conectionDB=async()=>{
    return await mongoose
    .connect(process.env.connection_url)
   
    .then((res)=>{console.log("conncted to trello DB")},)
    .catch((err)=>{console.log("fail to connect to trello DB",err)})
    
}
