import { BasePlugin } from './base/_base.plugin';
import {Logger} from '../lib/logger';
import {EthHdWallet} from '../lib/wallet';

const log = new Logger('PLGIN:InitMasterkeyPlugin');

export class InitMasterkeyPlugin extends BasePlugin {
  get pin() {
    return 'role:wallet,cmd:init';
  }

  handle(message: any) {
    log.info(message);

    const mnemonic = EthHdWallet.generateMnemonic();

    return {mnemonic};
  }
}

