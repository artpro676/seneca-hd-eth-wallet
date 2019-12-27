import autobind from 'autobind-decorator';

import { Logger } from './logger';

@autobind
export class SenecaLoggerAdapter {
  private log: Logger;

  constructor(log: Logger) {
    this.log = log;
  }

  preload() {

    // Seneca looks for logging adapters in `extend.logger`
    // simply assign your adapter to receive the logs.
    return {
      extend: {

        // Everything something is logged it calls whatever
        // custom adapter is set. Adapters are passed the
        // current instance of Seneca plus the raw payload.
        logger: (context: any, payload: any) => {

          const kind = this._pad(payload.kind || '-', 8).toUpperCase();
          const type = this._pad(payload.case || '-', 8).toUpperCase();
          const text = payload.pattern || payload.notice || '-';

          if (kind === 'FATAL' || payload.case === 'ERR') {
            this.log.error(kind, type, text);
          } else {
            this.log.info(kind, type, text);
          }
        }
      }
    };
  }

  private _pad(content: string, length: number){
    content = content || '';

    while (content.length < length) {
      content = content + ' ';
    }

    return content;
  }
}

