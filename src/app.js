import express from 'express';
import cors from 'cors';
import routes from 'src/routes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

export default app;
