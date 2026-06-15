import express from 'express'
import { signup, verifyEmail, resendVerification, logout, login, forgotPassword, resetPassword, checkauth } from '../controller/authcontroller.js'
import { verifyToken } from '../middleware/verifyToken.js'
const router = express.Router()
router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/verifyEmail', verifyEmail)
router.post('/resendVerification', verifyToken, resendVerification)
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword/:token', resetPassword)
router.get('/verify-token', verifyToken, checkauth)
export default router
   