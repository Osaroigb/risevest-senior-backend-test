import convict from 'convict';

const appConfig = convict({
  env: {
    default: 'development',
    env: 'NODE_ENV',
    doc: 'The application environment',
    format: ['production', 'staging', 'development', 'test'],
  },
  port: {
    arg: 'port',
    default: 3300,
    doc: 'The port to bind',
    env: 'APP_PORT',
    format: 'port',
  },
  baseUrl: {
    default: 'http://127.0.0.1:3300',
    doc: 'App base url',
    env: 'BASE_URL',
    nullable: false,
    format: String,
  },
  showLogs: {
    arg: 'show-app-logs',
    default: true,
    doc: 'To determine whether to show application logs',
    env: 'SHOW_APP_LOGS',
    nullable: true,
    format: Boolean,
  },
  jwt: {
    expiry: {
      default: 7200,
      doc: 'JWT expiry in seconds',
      env: 'JWT_EXPIRY_IN_SECONDS',
      nullable: true,
      format: Number,
    },
    secretKey: {
      default: '',
      doc: 'JWT secret key',
      env: 'JWT_SECRET_KEY',
      nullable: false,
      format: String,
    },
  },
});

export default appConfig;
