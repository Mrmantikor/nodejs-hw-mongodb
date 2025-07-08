import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import dotenv from 'dotenv';

import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';

import { swaggerDocs } from './middlewares/swaggerDocs.js';

dotenv.config();
const PORT = Number(getEnvVar('PORT', '2000'));

export const setupServer = () => {
  const app = express();
  app.use(express.json());

  app.use(cors());
  app.use(cookieParser());
  app.use(router);
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());
  app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
  });

  app.use('*', notFoundHandler);

  app.use(errorHandler);
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
