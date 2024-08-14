import {
  initializeServer,
  ServerOptions,
  authAppPort,
} from '@proxy-voting-monorepo/common-modules';
import router from './routes';

const serverOptions: ServerOptions = {
  appName: 'auth',
  port: parseInt(authAppPort, 10),
  router,
  middleware: [],
};

(async () => {
  await initializeServer(serverOptions);
})();
