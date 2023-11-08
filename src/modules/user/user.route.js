import { Router } from "express";
import * as uc from './user.controller.js'
import { asyncHandler } from "../../utils/errorhandling.js";
import { isAuthentcated } from "../../middlewares/auth.js";
import { validationCore } from "../../middlewares/validation.js";
import { logInValidationSchema, signUpSchema, validChangePassword, validUpdate, validationForDelete, validationForLogout, validationForSoftDelete, validationForTasks } from "./userValidationSchema.js";
const router =Router();
router.post('/signup',validationCore(signUpSchema),asyncHandler(uc.signUp))
router.get('/login',validationCore(logInValidationSchema),asyncHandler(uc.logIn))
router.get('/confirm/:token',asyncHandler(uc.ConfirmEmail))
router.get('/all',isAuthentcated(),validationCore(validationForTasks),asyncHandler(uc.tasksforoneuder))
router.patch('/cha',isAuthentcated(),validationCore(validChangePassword),asyncHandler(uc.changePass))
router.patch('/up',isAuthentcated(),validationCore(validUpdate),asyncHandler(uc.updateData))
router.patch('/so',isAuthentcated(),validationCore(validationForSoftDelete),asyncHandler(uc.softDelete))
router.patch('/logout',isAuthentcated(),validationCore(validationForLogout),asyncHandler(uc.logOut))
router.delete('/del',isAuthentcated(),validationCore(validationForDelete),asyncHandler(uc.deleteData))

export default router
