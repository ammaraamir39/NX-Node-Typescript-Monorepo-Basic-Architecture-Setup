import { Kafka, Producer } from 'kafkajs';
import logger from '../../utils/logger';

const KafkaProducer = () => {
  const createKafkaProducerInstance = (
    clientId: string,
    brokers: string[]
  ): Producer => {
    const kafka = new Kafka({ clientId, brokers });
    return kafka.producer();
  };

  const connectKafkaProducer = async (producer: Producer) => {
    try {
      await producer.connect();
      log('Kafka Producer connected', '');
    } catch (error: any) {
      logError('Error connecting Kafka Producer', error.message);
      throw error;
    }
  };

  const disconnectKafkaProducer = async (producer: Producer) => {
    try {
      await producer.disconnect();
      log('Kafka Producer disconnected', '');
    } catch (error: any) {
      logError('Error disconnecting Kafka Producer', error.message);
      throw error;
    }
  };

  const sendKafkaMessage = async (
    producer: Producer,
    topic: string,
    message: string
  ) => {
    try {
      await producer.send({
        topic,
        messages: [{ value: message }],
      });
      log(`Message sent to Kafka Topic "${topic}"`, `Message: ${message}`);
    } catch (error: any) {
      logError(
        `Error sending message to Kafka Topic "${topic}"`,
        error.message
      );
      throw error;
    }
  };

  const log = (context: string, value: any) =>
    logger.info(`Kafka Producer - ${context} => ${JSON.stringify(value)}`);

  const logError = (context: string, value: any) =>
    logger.error(`Kafka Producer - ${context} => ${JSON.stringify(value)}`);

  return {
    createKafkaProducerInstance,
    connectKafkaProducer,
    disconnectKafkaProducer,
    sendKafkaMessage,
  };
};

export default KafkaProducer;
