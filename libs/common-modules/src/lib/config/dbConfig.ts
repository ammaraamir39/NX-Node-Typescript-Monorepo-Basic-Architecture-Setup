import mongoose from 'mongoose';
import {
  mongoDbDatabase,
  mongoDBPassword,
  mongoDbUrl,
  mongoDbUsername,
  nodeEnv,
} from './envConfigs';
import logger from '../../utils/logger';

const DB_URL = mongoDbUrl || '';
const DB_NAME = mongoDbDatabase || '';
const DB_USER = mongoDbUsername || '';
const DB_PASSWORD = mongoDBPassword || '';
const DB_DEBUG = nodeEnv === 'development' ? true : false;

const Mongo = () => {
  const connect = async () => {
    try {
      mongoose.set('debug', DB_DEBUG);
      mongoose.connection
        .on('error', () => logger.error('Error while connecting database'))
        .on('open', () => {
          logger.info('Database connection open');
        })
        .on('connected', () => {
          logger.verbose('Database connected successfully');
        })
        .on('timeout', () => {
          logger.warn('Database connection timeout');
        })
        .on('close', () => {
          logger.error('Database connection closed');
        })
        .on('reconnectFailed', () => {
          logger.warn('Database reconnection failed');
        })
        .on('disconnected', () => {
          logger.error('Database disconnected');
        });
      await mongoose.connect(DB_URL, {
        user: DB_USER,
        pass: DB_PASSWORD,
        dbName: DB_NAME,
      });
    } catch (error: unknown) {
      logger.error(`Error while connecting to mongo => ${error}`);
    }
  };

  const disconnect = async () => {
    await mongoose.connection.close();
  };
  return { connect, disconnect };
};

export default Mongo;
