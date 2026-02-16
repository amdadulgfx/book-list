import { Router } from 'express';
import { bookRouter } from 'src/modules/routers';

const router = Router();

router.use('/books', bookRouter);

export default router;
