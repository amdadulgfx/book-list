import { Router } from 'express';
import { bookController } from 'src/modules/controllers';

export const bookRouter = Router();

bookRouter.get('/', bookController.getBooks);
