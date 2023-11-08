import joi from 'joi'
export const signUpSchema={
    body:joi.object({
        username:joi.string().min(3).max(10).required(),
        email:joi.string().email({tlds:{allow:['com','net','org']}}).required(),
        password:joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
        cpassword:joi.valid(joi.ref('password')).required(),
        gender:joi.string().optional().required(),
        age:joi.number().required(),
        phone:joi.number().min(8).required(),
        tasks:joi.array().required(),
    }).required(),
}
export const logInValidationSchema={
    body:joi.object({
        email:joi.string().email({tlds:{allow:['com','net','org']}}).required(),
        password:joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
    })
}
export const validChangePassword={
    auth:joi.object({
        id:joi.string().required(),
    }).required(),
    query:joi.object({
        _id:joi.string().required(),
    }).required(),
    body:joi.object({
        oldpass:joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
        cpass:joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
        password:joi.valid(joi.ref('cpass')).required(),
    }).required(),
}
export const validUpdate={
    auth:joi.object({
        id:joi.string().required(),
    }).required(),

    body:joi.object({
        username:joi.string().required(),
        age:joi.number().required(),
    }).required(),
    query:joi.object({
        _id:joi.string().required(),
    }).required(),
  
   
}
export const validationForDelete={
    auth:joi.object({
        id:joi.string().required(),
    }).required(),

   /* body:joi.object({
        username:joi.string().required(),
        age:joi.number().required(),
    }).required(),*/
    query:joi.object({
        _id:joi.string().required(),
    }).required(), 
}
export const validationForSoftDelete={
    auth:joi.object({
        id:joi.string().required(),
    }).required(),

   /* body:joi.object({
        username:joi.string().required(),
        age:joi.number().required(),
    }).required(),*/
    query:joi.object({
        _id:joi.string().required(),
    }).required(), 
}
export const validationForLogout={
    auth:joi.object({
        id:joi.string().required(),
    }).required(),
    query:joi.object({
        _id:joi.string().required(),
    }).required(), 
}
export const validationForTasks={
    auth:joi.object({
        id:joi.string().required(),
    }).required(),
    query:joi.object({
        userid:joi.string().required(),
    }).required(), 
}
