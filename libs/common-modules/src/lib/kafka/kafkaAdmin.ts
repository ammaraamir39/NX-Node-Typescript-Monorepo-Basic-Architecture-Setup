import { Kafka, Admin } from 'kafkajs';
import logger from '../../utils/logger';

const KafkaAdmin = () => {
  const createKafkaAdminInstance = (
    clientId: string,
    brokers: string[]
  ): Admin => {
    const kafka = new Kafka({ clientId, brokers });
    return kafka.admin();
  };

  const connectKafkaAdmin = async (admin: Admin) => {
    try {
      await admin.connect();
      log('Kafka Admin connected', '');
    } catch (error: any) {
      logError('Error connecting Kafka Admin', error.message);
      throw error;
    }
  };

  const disconnectKafkaAdmin = async (admin: Admin) => {
    try {
      await admin.disconnect();
      log('Kafka Admin disconnected', '');
    } catch (error: any) {
      logError('Error disconnecting Kafka Admin', error.message);
      throw error;
    }
  };

  const createKafkaTopic = async (
    admin: Admin,
    topic: string,
    numPartitions = 1
  ) => {
    try {
      await admin.createTopics({
        topics: [{ topic, numPartitions }],
      });
      log(
        `Kafka Topic "${topic}" created with ${numPartitions} partitions`,
        ''
      );
    } catch (error: any) {
      logError(`Error creating Kafka Topic "${topic}"`, error.message);
      throw error;
    }
  };

  const deleteKafkaTopic = async (admin: Admin, topic: string) => {
    try {
      await admin.deleteTopics({
        topics: [topic],
      });
      log(`Kafka Topic deleted`, topic);
    } catch (error: any) {
      logError(`Error deleting Kafka Topic "${topic}"`, error.message);
      throw error;
    }
  };

  const log = (context: string, value: any) =>
    logger.info(`Kafka Admin - ${context} => ${JSON.stringify(value)}`);

  const logError = (context: string, value: any) =>
    logger.error(`Kafka Admin - ${context} => ${JSON.stringify(value)}`);

  return {
    createKafkaAdminInstance,
    connectKafkaAdmin,
    disconnectKafkaAdmin,
    createKafkaTopic,
    deleteKafkaTopic,
  };
};

export default KafkaAdmin;
