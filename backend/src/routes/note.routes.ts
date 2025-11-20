import { Router } from 'express';
import * as noteController from '../controllers/note.controller';

const router = Router();

router.get('/', noteController.list);
router.post('/', noteController.create);
router.get('/:id', noteController.get);
router.put('/:id', noteController.update);
router.patch('/:id', noteController.update);
router.delete('/:id', noteController.remove);
router.patch('/:id/move', noteController.move);

export default router;