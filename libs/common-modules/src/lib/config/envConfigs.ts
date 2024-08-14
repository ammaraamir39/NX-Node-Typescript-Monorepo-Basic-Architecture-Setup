import * as dotenv from 'dotenv';

dotenv.config();

/**Database Variables */
export const mongoDbUrl = process.env['MONGO_DB_URL'];
export const mongoDbDatabase = process.env['MONGO_DB_DATABASE'];
export const mongoDbUsername = process.env['MONGO_DB_USERNAME'];
export const mongoDBPassword = process.env['MONGO_DB_PASSWORD'];

/**Node Environment */
export const nodeEnv = process.env['ENV'];

/**WEB URLS */
export const webUrl = process.env['WEB_URL'];

/**PORTS */
export const authAppPort = process.env['AUTH_APP_PORT'];
