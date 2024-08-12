import cors from 'cors';
import express, { Express, Request, Response, Router } from 'express';
import * as http from 'http';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import logger from '../utils/logger';
import Mongo from './config/dbConfig';
import { nodeEnv, webUrl } from './config/envConfigs';

interface ServerOptions {
  appName: string; // The name of the application
  router: Router; // The router specific to the application
  port: string;
  middleware?: Array<(app: Express) => void>; // Optional array of middleware functions
  afterDbConnect?: () => void; // Optional callback to run after DB connection
}

export async function initializeServer({
  appName,
  router,
  middleware = [],
  afterDbConnect,
  port,
}: ServerOptions): Promise<void> {
  const app = express();
  const server = http.createServer(app);
  const PORT = port || 3000;

  // Apply custom middleware if provided
  middleware.forEach((mw) => mw(app));

  app.get('/', (req: Request, res: Response) => {
    res.send('SERVER IS RUNNING');
  });

  // Default Middlewares
  app.use(cors({ origin: nodeEnv === 'development' ? '*' : webUrl }));
  app.use(helmet());
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));
  app.use(mongoSanitize());

  //   if (nodeEnv === 'development') {
  //     app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  //   }

  // Apply routes with appName as a base path
  app.use(`/api/v1/${appName}`, router);

  server.listen(PORT, () => {
    logger.verbose(`Server is listening on port: ${PORT}`);
  });

  logger.info('Trying to connect with database');
  await Mongo().connect();

  logger.verbose('🚀 Service started and ready to use');

  // Execute any post-database connection logic if provided
  if (afterDbConnect) {
    afterDbConnect();
  }
}
