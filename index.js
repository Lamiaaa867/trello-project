import express from 'express' 
import * as routes from './src/routes.js'

import { conectionDB } from './DB/connection.js';
import { config } from 'dotenv';
config()
const app= express();

conectionDB()
app.use(express.json())
app.use ('/user',routes.userRouter)
app.use ('/task',routes.taskRouter)

app.listen(process.env.port,()=>{
    console.log("server is runing")
})