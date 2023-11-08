import { isAuthentcated } from '../../middlewares/auth.js';
import { asyncHandler } from '../../utils/errorhandling.js';
import * as tc from './task.controller.js'
import { Router } from 'express'
const router=Router();
router.post('/at',isAuthentcated(),asyncHandler( tc.addTask))
router.get('/ge',asyncHandler( tc.getAllTaskWithUser))
router.get('/d',asyncHandler( tc.deadlineTask))
router.get('/all',isAuthentcated(),asyncHandler( tc.AllTasksForSelectedUser))
router.patch('/up',isAuthentcated(),asyncHandler( tc.updateTask))
router.delete('/del',isAuthentcated(),asyncHandler( tc.deleteTask))

export default router