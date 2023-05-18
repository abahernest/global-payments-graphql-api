import * as dotenv from 'dotenv'
dotenv.config();

interface KafkaConfig {
  BOOTSTRAP_SERVERS: string
  SASL_USERNAME: string
  SASL_PASSWORD: string
}
export function GetKafkaConfig(): KafkaConfig {
  return {
    BOOTSTRAP_SERVERS: process.env['BOOTSTRAP_SERVERS'],
    SASL_USERNAME: process.env['SASL_USERNAME'],
    SASL_PASSWORD: process.env['SASL_PASSWORD']
  }
};

export function GetKafkaBootstrapServer(): string {
  return process.env['BOOTSTRAP_SERVERS'];
}

export function GetKafkaSaslUsername(): string {
  return process.env['SASL_USERNAME'];
}

export function GetKafkaSaslPassword(): string {
  return process.env['SASL_PASSWORD'];
}