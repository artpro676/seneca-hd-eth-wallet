import * as plugins from './plugins';

import * as Seneca from 'seneca';
import { Logger, SenecaLoggerAdapter } from './lib/logger';

const log = new Logger('SENECA');

export class App {

  private seneca: Seneca.Instance;
  private options: any;

  constructor(config: any) {

    this.options = {
      type: 'http',
      port: config.PORT,
      host: config.HOST

      // type: 'sqs',
      // accessKeyId: '1',
      // secretAccessKey: '2',
      // queueUrl: 'http://localhost:9324/queue/default'

    };

    this.seneca = Seneca({
      internal: {
        logger: new SenecaLoggerAdapter(log)
      },
      timeout: 30000
    } as any);

    // this.seneca.use('seneca-sqs-transport');

    Object
      .values(plugins)
      .forEach(
        Plugin => {
          const plugin = new Plugin(config);
          this.seneca.add(plugin.methodSign, async (msg: any, reply) => {
            try {
              const result = await plugin.handle(msg);
              reply(null, result);
            } catch (err) {
              log.error(err);
              reply(err);
            }
          });
        }
      );
  }

  start() {
    return new Promise((res, rej) => {
      this
        .seneca
        .listen(this.options)
        .ready((err) => {
          if (err) {
            log.error(err);

            return rej(err);
          }
          log.info(`Started listener`);
          res();
        });
    });
  }
}
