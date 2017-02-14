const config = require('./config');

const configureDb = (nodeEnv) => {
  const envConfig = config[nodeEnv];
  const maybeEnvVariable = envConfig.use_env_variable;
  if (maybeEnvVariable) {
    return process.env[maybeEnvVariable];
  }
  const { username, password, database, host } = envConfig;
  return `postgres://${username}:${password}@${host}/${database}`;
};

module.exports = configureDb;
