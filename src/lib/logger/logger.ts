import { createLogger, format, transports } from 'winston';
import autobind from 'autobind-decorator';

const {combine, timestamp, label, printf} = format;

@autobind
export class Logger {

  private logger: any;

  constructor(labelStr: string) {

    this.logger = createLogger({
      level: 'info',
      transports: [
        new transports.Console()
      ],
      format: combine(
        label({label: labelStr}),
        timestamp(),
        printf((info: any) => {
          return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
        })
      )
    });
  }

  info(...args: any[]) {

    return this.logger.info(
      args
        .map(
          (m: any) => {
            let result;
            try {
              result = typeof m === 'object' ? JSON.stringify(m, null, 2) : m;
            } catch (e) {
              this.logger.error(e.message);
              result = m;
            }

            return result;
          })
        .join(' ')
    );
  }

  error(...args: any[]) {

    return this.logger.error(
      args.map(this.formatErrorArguments).join(' ')
    );
  }


  private formatErrorArguments(el: any) {
    switch (true) {
      // error
      case el instanceof Error:
        // log custom error attributes
        return [
          'name',
          'message',
          'code',
          'errors',
          'fields',
          'original',
          'parent',
          'sql',
          'stack'
        ].reduce((acc: string, key: string) => {

          const elByKey: any = (el as any)[key];

          if (!elByKey) {
            return acc;
          }
          try {
            const val = typeof elByKey === 'string' ? elByKey : JSON.stringify(elByKey, null, 2);

            return acc + `${key}: ${val}\n`;
          } catch (stringifyErr) {
            return acc + `${key}: error stringifying ${stringifyErr}`;
          }
        }, 'Error: \n');
      case typeof el === 'string' || typeof el === 'number':
        return el;
      case el === null:
        return 'null';
      case el === undefined:
        return 'undefined';
      // object
      case Object.prototype.toString.call(el) === '[object Object]':
      default:
        // anything else
        try {
          return JSON.stringify(el);
        } catch (err) {
          return `error stringifying ${el}: ${err.stack}`;
        }
    }
  }

}
