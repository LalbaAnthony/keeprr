import { Router } from 'express'
import { userController } from '../controllers/user.controller'
import { checkPermission } from '../middlewares/auth.middleware'

const router = Router()

router.post('/', checkPermission(), userController.create)
router.get('/:id', checkPermission(), userController.getById)
router.put('/:id', checkPermission(), userController.update)
router.delete('/:id', checkPermission(), userController.delete)

export default router
