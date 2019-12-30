export const configs = {
  PORT: process.env.PORT || 8000,
  HOST: process.env.HOST || 'localhost',

  DB_STORAGE: process.env.DB_STORAGE || ':memory',
  DB_ENCRYPT_KEY: process.env.DB_ENCRYPT_KEY || 'some-enryption-key',
};
