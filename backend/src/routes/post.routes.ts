import { Router } from 'express'
import { postController } from '../controllers/post.controller'
import { checkPermission } from '../middlewares/auth.middleware'

const router = Router()

router.get('/', postController.getAll)
router.get('/:id', postController.getById)
router.post('/', checkPermission(), postController.create)
router.put('/:id', checkPermission(), postController.update)
router.delete('/:id', checkPermission(), postController.delete)

export default router
