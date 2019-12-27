import { BasePlugin } from './base/_base.plugin';
import {Logger} from '../lib/logger';

const log = new Logger('PGN:SignTransactionPlugin');

export class SignTransactionPlugin extends BasePlugin {
  get pin() {
    return 'role:wallet,cmd:sign';
  }

  handle(message: any) {
    log.info(message);
    return {a: 1};
  }
}

