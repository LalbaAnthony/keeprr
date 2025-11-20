import { Router } from 'express'
import { noteController } from '../controllers/note.controller'
import { checkPermission } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', checkPermission(), noteController.getAll)
router.get('/:id', checkPermission(), noteController.getById)
router.post('/', checkPermission(), noteController.create)
router.put('/:id', checkPermission(), noteController.update)
router.delete('/:id', checkPermission(), noteController.delete)

export default router
