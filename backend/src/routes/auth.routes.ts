import { Router } from 'express'
import { authController } from '../controllers/auth.controller'

// * NB : all routes are POST to avoid putting sensitive info in URL (GET query)

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)
router.post('/password/send-code', authController.sendResetCode)
router.post('/password/reset', authController.resetPassword)

export default router
