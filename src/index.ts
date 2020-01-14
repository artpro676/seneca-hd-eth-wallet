import { configs } from './configs';
import { App } from './app';
import { Logger } from './lib/logger';

const log = new Logger('MAIN');
const app = new App(configs);

(async function() {
  try {

    process.on('SIGTERM', () => {
      log.error('Process has been terminated');
      process.exit(0);
    });

    process.on('uncaughtException', (err) => {
      log.error('Uncaught exception:', err);
    });

    process.on('unhandledRejection', (err) => {
      log.error('Unhandled Rejection:', err);

      if(err && (err as any).message.indexOf('SQLITE_NOTADB')>=0) {
        process.exit(1);
      }
    });


    await app.start();

  } catch (err) {
    log.error(err);
  }
}());
