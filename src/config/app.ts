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
});

export default appConfig;
