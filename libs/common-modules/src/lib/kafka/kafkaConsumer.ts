import { Kafka, Consumer } from 'kafkajs';
import logger from '../../utils/logger';

const KafkaConsumer = () => {
  const createKafkaConsumerInstance = (
    clientId: string,
    brokers: string[],
    groupId: string
  ): Consumer => {
    const kafka = new Kafka({ clientId, brokers });
    return kafka.consumer({ groupId });
  };

  const connectKafkaConsumer = async (consumer: Consumer) => {
    try {
      await consumer.connect();
      log('Kafka Consumer connected', '');
    } catch (error: any) {
      logError('Error connecting Kafka Consumer', error.message);
      throw error;
    }
  };

  const disconnectKafkaConsumer = async (consumer: Consumer) => {
    try {
      await consumer.disconnect();
      log('Kafka Consumer disconnected', '');
    } catch (error: any) {
      logError('Error disconnecting Kafka Consumer', error.message);
      throw error;
    }
  };

  const subscribeToKafkaTopic = async (consumer: Consumer, topic: string) => {
    try {
      await consumer.subscribe({ topic, fromBeginning: true });
      log(`Subscribed to Kafka Topic`, topic);
    } catch (error: any) {
      logError(`Error subscribing to Kafka Topic "${topic}"`, error.message);
      throw error;
    }
  };

  const runKafkaConsumer = async (
    consumer: Consumer,
    eachMessageHandler: (message: any) => void
  ) => {
    try {
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message?.value || '';
          eachMessageHandler({
            topic,
            partition,
            offset: message.offset,
            value,
          });
        },
      });
      log('Kafka Consumer is running', '');
    } catch (error: any) {
      logError('Error running Kafka Consumer', error.message);
      throw error;
    }
  };

  const log = (context: string, value: any) =>
    logger.info(`Kafka Consumer - ${context} => ${JSON.stringify(value)}`);

  const logError = (context: string, value: any) =>
    logger.error(`Kafka Consumer - ${context} => ${JSON.stringify(value)}`);

  return {
    createKafkaConsumerInstance,
    connectKafkaConsumer,
    disconnectKafkaConsumer,
    subscribeToKafkaTopic,
    runKafkaConsumer,
  };
};

export default KafkaConsumer;
