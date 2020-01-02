import {App} from '../src/app';

export function getAppInstance () {

  const config = {
    PORT: 8001,
    HOST: 'localhost',
    DB_STORAGE: ':memory:',
    DB_ENCRYPT_KEY: 'some-enryption-key',
  };

  const app = new App(config);

  return app.start();
}
