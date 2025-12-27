import { Router } from 'express';
import { getCommentsByEvent, addComment } from '../controllers/event_comment.controller';

const router = Router();

router.get('/event/:eventId', getCommentsByEvent);
router.post('/', addComment);

export default router;
